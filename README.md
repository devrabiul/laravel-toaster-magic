# Laravel Toaster Magic — Documentation Website

The source for the [Laravel Toaster Magic](https://github.com/devrabiul/laravel-toaster-magic)
documentation site, built with **React + Vite + TypeScript** and deployed to GitHub Pages from
this `docs` branch.

> This branch is **independent** from the package on `main`. It only contains the docs website.
> It consumes the published `toaster-magic` npm package to power the live, interactive toast demos
> (the same rendering engine the Laravel package ships).

## Local development

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build
```

## Deployment

Pushing to the `docs` branch triggers `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to GitHub Pages. The production base path is `/laravel-toaster-magic/`.

## Structure

- `src/data/routes.ts` — the canonical route table (drives the sidebar, search, sitemap, prev/next).
- `src/data/reference.ts` — structured config/option/method reference data.
- `src/components/` — layout, navbar, sidebar, search, code blocks, callouts, live toast demos.
- `src/pages/` — one file per documentation page.
- `vite.config.ts` — base path, SEO asset generation (sitemap.xml + robots.txt).

## License

MIT © [Muhammad Rabiul](https://github.com/devrabiul)
