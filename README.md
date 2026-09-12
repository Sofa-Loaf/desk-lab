# Desk Lab

Free, client-side **MSP call sheet** for Dell desks.

ICP: MSP techs on remote or onsite calls. Client has some mix of OptiPlex, Precision, WD19, Dell monitor, UPS. Not a consumer toy.

Toggle **what’s on this client’s desk**. Open the product photo. Front/Back (or Left/Right) tabs. Ports sit on the real jacks: barrel/DC-in, USB-C upstream, DP out, UPS AC out. Playbooks are the script — you read, they touch the jack.

- No power on dock → WD19 barrel/DC-in (the brick, not USB-C). Coach: “That’s power on the WD19 — pull that one.”
- No display → WD19 DP/HDMI out to monitor HDMI 1 / HDMI 2 / USB-C DP
- Laptop not charging on dock → WD19 front USB-C upstream
- Dead desk → UPS front switch + rear BATTERY BACKUP outlets (not surge-only)

No account. No backend. No Stripe. Photos are the desk. Product shots are real hardware (WD19 Commons K20A-5812/5814, OptiPlex 3080 Micro Support figures, Precision 5570 setup PDF, S3423DWC Commons port bay, APC Back-UPS XS 1000 Commons). Attribution: [assets/desk-lab/README.md](assets/desk-lab/README.md).

**Live (28to3 mirror):** https://28to3.me/apps/desk-lab.html

**GitHub Pages:** https://sofa-loaf.github.io/desk-lab/ after Settings → Pages → Deploy from a branch → `main` / root. Details: [docs/github-pages.md](docs/github-pages.md).

## How to use

1. Open `index.html` via a local static server, Pages, or the 28to3 mirror.
2. Check the boxes for what is actually on the desk.
3. Click a device photo. Use Front/Back or Left/Right. Or start a playbook and read the coach line — the hotspot on the photo is the jack.
4. **Copy ticket note** if you want the desk + playbook + port in the ticket.

Hash is shareable: `#desk=precision,wd19,monitor&playbook=dock-power&device=wd19&port=wd19-dc`.

## Copy into 28to3

Same cycle as this repo:

- Lab page → `apps/desk-lab.html` (28to3 chrome around the same picker / photos / playbooks)
- `css/app.css` core → `apps/desk-lab.css`
- `js/app.js` → `apps/desk-lab.js`
- Product photos → `apps/assets/desk-lab/`

No build step. No npm install. Do not invent Stripe for this tool.

## GitHub Pages

Static from the root (`index.html`). Enable Pages with **Deploy from a branch** (`main`, `/ root`). Details: [docs/github-pages.md](docs/github-pages.md).

## Develop / test

```bash
python3 -m http.server 4173
# open http://127.0.0.1:4173
node --test tests/app.test.js
```

## License

MIT. Keep the existing [LICENSE](LICENSE).
