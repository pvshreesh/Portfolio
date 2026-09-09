# Production deployment

## Audit and hosting decision

The portfolio is purely static HTML/CSS/JavaScript with local fonts, images, and PDFs. It has no CDN dependencies, backend, runtime secrets, or application environment variables. All asset references are relative, and section routes are hash anchors. The title, description, Open Graph basics, favicon, and current resume are already present.

The existing build script is retained because it copies only public files to `dist/`. No framework compilation is needed. `package.json` remains useful for preview, packaging, and the existing browser tests; its dependencies are development-only. `server.mjs` is required by those tests and local preview, and is never hosted.

Vercel is the production target. The existing `vercel.json` supplies four meaningful settings: Other framework, no install step, `node build.mjs`, and `dist` output. Routing overrides were removed because hash navigation needs none. These settings follow [Vercel's static configuration documentation](https://vercel.com/docs/project-configuration/vercel-json).

Repository cleanup removed unused Windows command wrappers and the duplicate README. The README stash conflict was resolved against an empty upstream README. The public HTML, CSS, JavaScript, and asset bytes were preserved. Source and available Git history scans found no credential patterns or committed environment files. Ignore rules exclude dependencies, generated output, test artifacts, Vercel account metadata, environment files, and logs.

## Connect Vercel and publish

1. Sign in at https://vercel.com/new using the account that should own this portfolio.
2. Import https://github.com/pvshreesh/Portfolio. Authorize Vercel's GitHub access to this repository if requested.
3. Use the repository root (`./`) and production branch `main`.
4. Framework preset: **Other**. The checked-in configuration sets install to skipped, build to `node build.mjs`, and output to `dist`.
5. Leave environment variables empty. Click **Deploy**.
6. Use the assigned production `https://...vercel.app` domain, and confirm anonymous visitors can open it. If deployment protection is enabled for production, turn it off for this public portfolio.

The Git integration can deploy future changes to `main` without a custom CI workflow. A custom domain is optional.

Alternatively, authorize the local CLI with `npx vercel login`, then run `npx vercel --prod` from this folder. Select your account, link the intended project, and use `./` as the code directory. No credentials belong in this repository.

## Verify the actual production URL

With Node.js 22 and Google Chrome installed:

```sh
npm ci
npm run test:production -- https://YOUR-PRODUCTION-DOMAIN.vercel.app
```

The check covers HTTPS, desktop/tablet/mobile layouts, homepage and direct refresh, architecture tabs, case studies, navigation, current resume opening, exact asset bytes, accessibility, email target, external links, and browser errors. It saves `test-results/production.json` locally. LinkedIn sometimes returns HTTP 999/403/429 to automation; when reported, open the supplied profile in a normal browser.

Both resume filenames are current and should remain identical when updating the PDF. Hosting does not require any environment variables, functions, Docker files, databases, or routing middleware.
