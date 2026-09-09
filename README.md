# Venkata Shreesh Poojari - Portfolio

**Live:** https://portfolio-pink-nu-41.vercel.app

Static HTML, CSS, and JavaScript portfolio. Production needs no application server, environment variables, or runtime dependencies.

## Local preview

With Node.js 22 installed, run `npm run dev` and open http://127.0.0.1:8000. Package installation is not needed for preview or build.

## Build

Run `npm run build`. This only copies the approved site files and assets into `dist/`; it does not compile a framework. Deploying just this folder keeps development files and documentation off the public site.

## Vercel

The production project is `portfolio-72d1/portfolio`. It uses the repository root; `main` is the GitHub production branch. The existing `vercel.json` supplies the settings:

- Framework: Other
- Install command: skipped
- Build command: `node build.mjs`
- Output directory: `dist`
- Environment variables: none

No routing rewrite is needed: all sections use hash navigation. The initial production deployment was published through the authenticated CLI. Automatic GitHub deployments still require granting the Vercel GitHub integration access to this repository and connecting it in [project Git settings](https://vercel.com/portfolio-72d1/portfolio/settings/git). See [DEPLOYMENT.md](DEPLOYMENT.md).

## Tests

Run `npm ci`, then `npm test`. The browser checks use installed Google Chrome. Alternatively run `npx playwright install chromium` and set `BROWSER_CHANNEL=chromium` before testing (PowerShell: `$env:BROWSER_CHANNEL = 'chromium'`). Dependencies are development-only.

After publishing, run:

```sh
npm run test:production -- https://portfolio-pink-nu-41.vercel.app
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
