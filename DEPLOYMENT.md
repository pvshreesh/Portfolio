# Production deployment

## Live status

- Production URL: https://portfolio-pink-nu-41.vercel.app
- Vercel project: `portfolio-72d1/portfolio`.
- Published source commit: `7e2f3cbf398f37ae1352e3a45ebed57232478ca8`.
- Deployment ID: `dpl_73NeyM5PbyWiFGNCQSM4YqGbhzWT`.
- Status: production READY; anonymous HTTPS access verified.
- Browser verification passed at desktop, tablet, and mobile widths. Homepage refresh, six architecture stages, case studies, navigation, PDF opening, assets, accessibility, and browser error checks passed. GitHub links returned 200. LinkedIn returned its automation-blocking status 999 and requires a normal-browser check.
- Automatic deployments on GitHub pushes are not connected yet: Vercel's repository integration rejected access. The current site is publicly deployed and does not depend on completing that integration.

## Audit and hosting decision

The portfolio is purely static HTML/CSS/JavaScript with local fonts, images, and PDFs. It has no CDN dependencies, backend, runtime secrets, or application environment variables. All asset references are relative, and section routes are hash anchors. The title, description, Open Graph basics, favicon, and current resume are already present.

The existing build script is retained because it copies only public files to `dist/`. No framework compilation is needed. `package.json` remains useful for preview, packaging, and the existing browser tests; its dependencies are development-only. `server.mjs` is required by those tests and local preview, and is never hosted.

Vercel is the production target. The existing `vercel.json` supplies four meaningful settings: Other framework, no install step, `node build.mjs`, and `dist` output. Routing overrides were removed because hash navigation needs none. These settings follow [Vercel's static configuration documentation](https://vercel.com/docs/project-configuration/vercel-json).

Repository cleanup removed unused Windows command wrappers and the duplicate README. The README stash conflict was resolved against an empty upstream README. The public HTML, CSS, JavaScript, and asset bytes were preserved. Source and available Git history scans found no credential patterns or committed environment files. Ignore rules exclude dependencies, generated output, test artifacts, Vercel account metadata, environment files, and logs.

## Enable automatic GitHub deployments

1. Open [the existing project's Git settings](https://vercel.com/portfolio-72d1/portfolio/settings/git).
2. Connect GitHub and authorize the Vercel integration to access `pvshreesh/Portfolio` if requested.
3. Connect that repository, with the root directory `./` and production branch `main`.
4. Keep Framework **Other**, skipped installation, build `node build.mjs`, and output `dist`. Leave environment variables empty.

The Git integration can deploy future changes to `main` without a custom CI workflow. A custom domain is optional.

For manual production updates, run `npx vercel --prod --scope portfolio-72d1` from this already-linked folder. On another machine, first run `npx vercel login` and `npx vercel link --project portfolio --scope portfolio-72d1`. No credentials belong in this repository.

## Verify the actual production URL

With Node.js 22 and Google Chrome installed:

```sh
npm ci
npm run test:production -- https://portfolio-pink-nu-41.vercel.app
```

The check covers HTTPS, desktop/tablet/mobile layouts, homepage and direct refresh, architecture tabs, case studies, navigation, current resume opening, exact asset bytes, accessibility, email target, external links, and browser errors. It saves `test-results/production.json` locally. LinkedIn sometimes returns HTTP 999/403/429 to automation; when reported, open the supplied profile in a normal browser.

Both resume filenames are current and should remain identical when updating the PDF. Hosting does not require any environment variables, functions, Docker files, databases, or routing middleware.
