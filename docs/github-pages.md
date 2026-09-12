# GitHub Pages

Desk Lab is a static site: `index.html`, `css/`, and `js/` at the repository root.

## Enable Pages

1. Open the repo **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Merge this workflow (`.github/workflows/pages.yml`) to the default branch.
4. The site publishes at `https://sofa-loaf.github.io/desk-lab/`.

If Pages is not enabled, the deploy job will not have an environment to write to. The call sheet still works by opening `index.html` through a local static server or the 28to3 mirror: [28to3.me/apps/desk-lab.html](https://28to3.me/apps/desk-lab.html).

## What the workflow uploads

Only the files needed to run the lab:

- `index.html`
- `css/`
- `js/`
- `LICENSE`
- `README.md`

No backend, no tokens in the page, no account flow, no Stripe.
