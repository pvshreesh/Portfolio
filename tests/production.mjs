import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = new URL(process.argv[2] || 'https://missing-deployment-url.invalid');
assert.equal(base.protocol, 'https:', 'Pass the HTTPS production URL: npm run test:production -- https://your-site.vercel.app');
assert.ok(!base.hostname.endsWith('.invalid'), 'Production URL is required');
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
const report = { url: base.href, checkedAt: new Date().toISOString(), viewports: [], assets: [], externalLinks: [], errors: [] };
await mkdir(new URL('../test-results/', import.meta.url), { recursive: true });
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', (error) => report.errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') report.errors.push(message.text()); });
  page.on('response', (response) => { if (new URL(response.url()).origin === base.origin && response.status() >= 400) report.errors.push(response.status() + ' ' + response.url()); });
  for (const [width, height] of [[1440, 1000], [768, 1024], [390, 844]]) {
    await page.setViewportSize({ width, height });
    assert.equal((await page.goto(base.href)).status(), 200);
    assert.equal(new URL(page.url()).protocol, 'https:');
    await page.evaluate(() => document.fonts.ready);
    assert.match(await page.title(), /Venkata Shreesh Poojari/);
    assert.equal(await page.locator('h1').count(), 1);
    for (const tab of await page.getByRole('tab').all()) {
      await tab.click();
      assert.equal(await tab.getAttribute('aria-selected'), 'true');
      assert.equal(await page.getByRole('tabpanel').getAttribute('id'), await tab.getAttribute('data-stage'));
    }
    assert.equal(await page.getByRole('tab').count(), 6);
    assert.equal((await page.reload()).status(), 200);
    assert.equal(await page.getByRole('tabpanel').getAttribute('id'), 'stage-itinerary');
    for (const summary of await page.locator('details summary').all()) await summary.click();
    assert.equal(await page.locator('details[open]').count(), 3);
    await page.locator('.product-capture').scrollIntoViewIfNeeded();
    await page.locator('.product-capture img').evaluate((image) => image.decode());
    for (const link of await page.locator('.site-nav a').all()) {
      await link.click();
      assert.ok(page.url().endsWith(await link.getAttribute('href')));
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map((v) => v.id), []);
    report.viewports.push({ width, height, refresh: 'passed', navigation: 'passed', architecture: 'passed', disclosures: 'passed', accessibility: 'passed' });
    console.log(width + 'px: production browser checks passed');
  }
  for (const file of ['index.html', 'styles.css', 'script.js', 'assets/favicon.svg', 'assets/manrope-latin.woff2', 'assets/accio-overview.png', 'assets/venkata-shreesh-poojari-resume.pdf', 'assets/Resume_Venkata Shreesh Poojari.pdf']) {
    const response = await context.request.get(new URL(file === 'index.html' ? './' : file, base).href);
    assert.equal(response.status(), 200, file);
    assert.deepEqual(await response.body(), await readFile(new URL('../' + file, import.meta.url)), file + ' must match the approved local file');
    if (file.endsWith('.pdf')) assert.match(response.headers()['content-type'], /application\/pdf/);
    report.assets.push({ file, status: 200, matchesLocal: true });
  }
  const popupPromise = page.waitForEvent('popup');
  await page.locator('.hero-actions a[href$=".pdf"]').click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  assert.ok(popup.url().endsWith('/assets/venkata-shreesh-poojari-resume.pdf'));
  await popup.close();
  assert.equal(await page.locator('.contact-email').getAttribute('href'), 'mailto:pvshreesh6@gmail.com');
  for (const url of await page.locator('a[href^="https:"]').evaluateAll((links) => [...new Set(links.map((link) => link.href))])) {
    const response = await context.request.get(url);
    const blocked = new URL(url).hostname.endsWith('linkedin.com') && [403, 429, 999].includes(response.status());
    assert.ok(response.ok() || blocked, 'External link: ' + url);
    report.externalLinks.push({ url, status: response.status(), result: blocked ? 'LinkedIn blocks automated access; manual verification needed' : 'passed' });
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'smooth');
  await page.locator('.button').first().hover();
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  assert.deepEqual(report.errors, []);
  await writeFile(new URL('../test-results/production.json', import.meta.url), JSON.stringify(report, null, 2));
  console.log('PASS: HTTPS, refresh, assets, current PDF, contact links, interactions and mobile layout.');
} finally {
  await browser.close();
}
