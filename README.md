# Desk Lab

Free, client-side **MSP call sheet** for Dell desks.

ICP: MSP techs on remote or onsite calls. Client has some mix of OptiPlex, Precision, WD19, Dell monitor, UPS. Not a consumer toy.

Toggle **what’s on this client’s desk**. Click a box. Ports are ticket labels: barrel/DC-in, USB-C upstream, DP out, UPS AC out. Playbooks are the script — you read, they touch the jack.

- No power on dock → WD19 barrel/DC-in (the brick, not USB-C)
- No display → DP/HDMI from dock to monitor IN
- Laptop not charging on dock → USB-C upstream
- Dead desk → UPS switch + battery-backed outlets

No account. No backend. No Stripe. Labels beat photorealism.

**Live (28to3 mirror):** https://28to3.me/apps/desk-lab.html

**GitHub Pages:** https://sofa-loaf.github.io/desk-lab/ (after Pages is enabled — see [docs/github-pages.md](docs/github-pages.md))

## How to use

1. Open `index.html` via a local static server, Pages, or the 28to3 mirror.
2. Check the boxes for what is actually on the desk.
3. Start a playbook and read the coach line aloud. Or click a device and a port.
4. **Copy ticket note** if you want the desk + playbook + port in the ticket.

Hash is shareable: `#desk=precision,wd19,monitor&playbook=dock-power&device=wd19&port=wd19-dc`.

## Copy into 28to3

Same cycle as this repo:

- Lab page → `apps/desk-lab.html` (28to3 chrome around the same picker / SVG / playbooks)
- `css/app.css` core → `apps/desk-lab.css`
- `js/app.js` → `apps/desk-lab.js`

No build step. No npm install. Do not invent Stripe for this tool.

## GitHub Pages

Static from the root (`index.html`). Workflow: `.github/workflows/pages.yml`. Enable Pages (Settings → Pages → GitHub Actions). Details: [docs/github-pages.md](docs/github-pages.md).

## Develop / test

```bash
python3 -m http.server 4173
# open http://127.0.0.1:4173
node --test tests/app.test.js
```

## License

MIT. Keep the existing [LICENSE](LICENSE).
