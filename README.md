# Venkata Shreesh Poojari - Portfolio

Static HTML, CSS, and JavaScript portfolio. Production needs no application server, environment variables, or runtime dependencies.

## Local preview

With Node.js 22 installed, run `npm run dev` and open http://127.0.0.1:8000. Package installation is not needed for preview or build.

## Build

Run `npm run build`. This only copies the approved site files and assets into `dist/`; it does not compile a framework. Deploying just this folder keeps development files and documentation off the public site.

## Vercel

Import [pvshreesh/Portfolio](https://github.com/pvshreesh/Portfolio) into your Vercel account. Use the repository root and production branch `main`. The existing `vercel.json` supplies the settings:

- Framework: Other
- Install command: skipped
- Build command: `node build.mjs`
- Output directory: `dist`
- Environment variables: none

Vercel provides an HTTPS production URL. No routing rewrite is needed: all sections use hash navigation. See [DEPLOYMENT.md](DEPLOYMENT.md) for authorization and verification steps.

## Tests

Run `npm ci`, then `npm test`. The browser checks use installed Google Chrome. Alternatively run `npx playwright install chromium` and set `BROWSER_CHANNEL=chromium` before testing (PowerShell: `$env:BROWSER_CHANNEL = 'chromium'`). Dependencies are development-only.

After publishing, run:

```sh
npm run test:production -- https://YOUR-PRODUCTION-DOMAIN.vercel.app
```

The production check validates HTTPS, asset bytes, refresh, navigation, project interactions, mobile layout, PDF access, links, and browser errors. LinkedIn may block automated checks; verify that profile in a normal browser when reported. Evidence is saved locally under ignored `test-results/`.

## Content

- `index.html`: portfolio content and architecture descriptions.
- `styles.css`: visual design and responsive behavior.
- `script.js`: architecture tabs, section navigation, and deep links.
- `assets/`: local font, favicon, project capture, and current resume.
- `assets/venkata-shreesh-poojari-resume.pdf`: canonical resume; the older filename contains an identical copy for existing inbound links.

Keep both resume filenames current. TravelMate has no verified public repository/live URL yet; no placeholder link is published.

[Design and content provenance](DESIGN.md) | [Design quality review](QUALITY.md)
