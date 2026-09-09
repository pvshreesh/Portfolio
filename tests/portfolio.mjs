import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = new URL('../test-results/', import.meta.url);
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, ['server.mjs'], { cwd: root, env: { ...process.env, PORT: '0' }, windowsHide: true, stdio: ['ignore', 'pipe', 'inherit'] });
let browser;
const report = { viewports: [], accessibility: [], checks: [], loading: {} };

async function noOverflow(page, label) {
  const issues = await page.evaluate(() => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) issues.push('page');
    for (const element of document.querySelectorAll('.architecture, .project-diagram, .toolkit-list, pre')) {
      if (element.clientWidth && element.scrollWidth > element.clientWidth + 1) issues.push(element.className || element.tagName);
    }
    return issues;
  });
  assert.deepEqual(issues, [], label + ': overflow');
}

async function audit(page, label) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
  const violations = result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }));
  report.accessibility.push({ label, violations });
  assert.deepEqual(violations, [], label + ': accessibility');
}

try {
  const base = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview server did not start')), 10000);
    server.on('error', reject);
    server.stdout.on('data', (data) => {
      const match = data.toString().match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) { clearTimeout(timeout); resolve(match[0]); }
    });
  });
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
  const context = await browser.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1024, 768], [1440, 1000], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    const response = await page.goto(base);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await noOverflow(page, String(width));
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('[role="tabpanel"]:visible').count(), 1);
    assert.equal(await page.locator('[role="tab"][aria-selected="true"]').getAttribute('data-stage'), 'stage-validate');
    if ([390, 768, 1440].includes(width)) {
      await page.screenshot({ path: fileURLToPath(new URL('hero-' + width + '.png', output)) });
      await page.screenshot({ path: fileURLToPath(new URL('full-' + width + '.png', output)), fullPage: true });
      await audit(page, width + ' default');
    }
    for (const tab of await page.getByRole('tab').all()) {
      await tab.click();
      assert.equal(await tab.getAttribute('aria-selected'), 'true');
      assert.equal(await page.getByRole('tabpanel').count(), 1);
      assert.equal(await page.getByRole('tabpanel').getAttribute('id'), await tab.getAttribute('data-stage'));
      await noOverflow(page, width + ' ' + await tab.getAttribute('data-stage'));
    }
    for (const summary of await page.locator('details summary').all()) {
      await summary.click();
    }
    assert.equal(await page.locator('details[open]').count(), 3);
    await page.locator('.product-capture').scrollIntoViewIfNeeded();
    await page.locator('.product-capture img').evaluate((image) => image.decode());
    assert.ok(await page.locator('.product-capture img').evaluate((image) => image.naturalWidth > 0));
    await noOverflow(page, width + ' expanded');
    if ([390, 768, 1440].includes(width)) await audit(page, width + ' expanded');
    for (const link of await page.locator('.site-nav a').all()) {
      const target = await link.getAttribute('href');
      await link.click();
      assert.ok(page.url().endsWith(target));
      const bounds = await page.locator(target).boundingBox();
      const header = await page.locator('.site-header').boundingBox();
      assert.ok(bounds.y >= header.height - 1 && bounds.y < height, target + ' should clear sticky header');
    }
    report.viewports.push({ width, height, overflow: false, stages: 6, details: 3, navigation: 'passed' });
    console.log(width + 'px: layout, architecture, case studies, navigation passed');
  }

  await page.goto(base);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
  await page.locator('#tab-stage-validate').focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'tab-stage-maps');
  await page.keyboard.press('Home');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'tab-stage-input');
  await page.keyboard.press('End');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'tab-stage-itinerary');
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'tab-stage-input');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'stage-itinerary');
  await page.locator('[data-open-details]').click();
  assert.equal(await page.locator('#travelmate-notes').getAttribute('open'), '');
  await page.goto(base + '/#stage-extract');
  assert.equal(await page.getByRole('tabpanel').getAttribute('id'), 'stage-extract');
  await page.goto(base + '/#fashion-notes');
  assert.equal(await page.locator('#fashion-notes').getAttribute('open'), '');
  await page.goto(base + '/#%E0%A4%A'); // Malformed fragments must not break the site.
  report.checks.push('Keyboard skip link, tabs, arrow keys, wrapping, case-study link, deep links, malformed hash');

  const sourcePdf = await readFile(new URL('../assets/venkata-shreesh-poojari-resume.pdf', import.meta.url));
  const responsePdf = await context.request.get(base + '/assets/venkata-shreesh-poojari-resume.pdf');
  assert.equal(responsePdf.status(), 200);
  assert.match(responsePdf.headers()['content-type'], /application\/pdf/);
  assert.deepEqual(await responsePdf.body(), sourcePdf);
  const oldPdf = await context.request.get(base + '/assets/Resume_Venkata%20Shreesh%20Poojari.pdf');
  assert.deepEqual(await oldPdf.body(), sourcePdf);
  report.checks.push('PDF response, content type, complete bytes, and legacy résumé URL');
  report.resumeSha256 = createHash('sha256').update(sourcePdf).digest('hex');
  const assetUrls = await page.locator('[src], link[href]').evaluateAll((elements) => elements.map((element) => element.getAttribute('src') || element.getAttribute('href')));
  for (const url of new Set(assetUrls)) assert.equal((await context.request.get(base + '/' + url)).status(), 200, url);
  const externalLinks = await page.locator('a[href^="https:"]').evaluateAll((links) => links.map((link) => ({ href: link.href, rel: link.rel, target: link.target })));
  assert.ok(externalLinks.every((link) => link.target === '_blank' && link.rel.includes('noopener')));
  report.externalLinks = [...new Set(externalLinks.map((link) => link.href))];
  for (const path of ['/.git/config', '/package.json', '/tests/portfolio.mjs', '/assets/../server.mjs', '/missing.html']) {
    assert.equal((await context.request.get(base + path)).status(), 404, path);
  }
  assert.equal((await context.request.post(base)).status(), 405);
  assert.equal((await context.request.head(base)).status(), 200);
  report.checks.push('All local assets, external-link attributes, preview server public-file boundary and HTTP methods');

  const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJs = await noJsContext.newPage();
  await noJs.goto(base);
  assert.equal(await noJs.locator('.stage-panel:visible').count(), 6);
  await noJs.locator('#travelmate-notes summary').click();
  assert.equal(await noJs.locator('#travelmate-notes').getAttribute('open'), '');
  await noOverflow(noJs, 'No JavaScript');
  await noJsContext.close();
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  assert.equal(await page.locator('.button').first().evaluate((element) => getComputedStyle(element).transitionDuration), '0s');
  report.checks.push('No-JavaScript content and native disclosures; reduced-motion scrolling and transitions');

  const normalContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
  const normal = await normalContext.newPage();
  await normal.addInitScript(() => {
    window.portfolioVitals = { cls: 0, lcp: 0 };
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (!entry.hadRecentInput) window.portfolioVitals.cls += entry.value; })).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => { window.portfolioVitals.lcp = list.getEntries().at(-1).startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  const cdp = await normalContext.newCDPSession(normal);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await normal.goto(base);
  await normal.evaluate(() => document.fonts.ready);
  await normal.waitForTimeout(300); // Let buffered paint/layout entries reach the observers.
  report.loading = await normal.evaluate(() => ({ ...window.portfolioVitals, initialBytes: performance.getEntriesByType('resource').reduce((sum, entry) => sum + entry.decodedBodySize, performance.getEntriesByType('navigation')[0].decodedBodySize), loadMs: performance.getEntriesByType('navigation')[0].loadEventEnd, requests: performance.getEntriesByType('resource').map((entry) => new URL(entry.name).pathname), activeAnimations: document.getAnimations().length }));
  assert.ok(report.loading.initialBytes < 150000, 'Initial page should stay below 150 KB');
  assert.ok(report.loading.cls <= 0.1, 'Layout shift should stay below 0.1');
  assert.equal(report.loading.activeAnimations, 0, 'No continuous animation');
  assert.equal(await normal.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'smooth');
  await normal.setViewportSize({ width: 640, height: 480 });
  await normal.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await noOverflow(normal, '200% text zoom');
  report.checks.push('Throttled mobile loading, layout shift, no continuous animations, 200% text zoom');
  assert.deepEqual(errors, [], 'Browser console errors');
  await writeFile(new URL('report.json', output), JSON.stringify(report, null, 2));
  console.log('PASS: all browser checks. Evidence: test-results/report.json');
  console.log(JSON.stringify(report.loading));
} finally {
  await browser?.close();
  server.kill();
}
