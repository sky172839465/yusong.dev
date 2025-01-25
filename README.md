# Vite SPA starter

### Feature

- Vite
- SPA mode, put router in `pages` folder
  - page nameing `index.jsx`
  - loader naming `index.loader.js`
- Tailwind CSS + daisyUI
- ESLint

### CI

- dependabot on pr open
  - enable `Dependabot alerts` > `Dependabot alerts, Dependabot security updates, Grouped security updates, Dependabot on Actions runners`<br />
    https://github.com/sky172839465/vite-spa-starter/security
- deploy ghp-ages on merge
  - create `GITHUB_TOKEN` with permission `project, repo, user, workflow`<br />
    https://github.com/settings/tokens
  - allow repo deploy gh-pages `Build and deployment > Source > GitHub Actions`<br />
    https://github.com/sky172839465/vite-spa-starter/settings/pages

### Develop on stackblitz

- https://stackblitz.com/~/github.com/sky172839465/vite-spa-starter
