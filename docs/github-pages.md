# GitHub Pages

Desk Lab is a static site: `index.html`, `css/`, `js/`, and `assets/desk-lab/` at the repository root.

## Enable Pages

Fastest path (no Actions required):

1. Open the repo **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Branch: `main`. Folder: `/ (root)`.
4. The site publishes at `https://sofa-loaf.github.io/desk-lab/`.

An Actions workflow is optional. This token cannot write `.github/workflows/*`. If you add one later, use Settings → Pages → Source: GitHub Actions.

If Pages is not enabled, the call sheet still works by opening `index.html` through a local static server or the 28to3 mirror: [28to3.me/apps/desk-lab.html](https://28to3.me/apps/desk-lab.html).

## What to publish

- `index.html`
- `css/`
- `js/`
- `assets/desk-lab/`
- `LICENSE`
- `README.md`
- `.nojekyll`

No backend, no tokens in the page, no account flow, no Stripe.
