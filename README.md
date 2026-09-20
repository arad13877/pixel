# Pixel homepage

Persian RTL homepage for **پیکسل**: website design first, custom AI agents second.

## Local use

```sh
npm install
npm run dev
npm run build
npm run preview -- --port 4173
npm test
```

The build generates a complete static `dist/index.html` via React server rendering in the Vite HTML transform. React hydrates this markup for agent tabs, the mobile menu and the sticky contact button. No runtime server, database, external fonts or analytics service is required. Do not deploy the source `index.html`; deploy the built `dist` directory.

## Content and contact

- WhatsApp configuration and message generation: `src/site.ts`.
- Agent descriptions and FAQ copy: `src/content.ts`.
- Theme and responsive layout: `src/styles.css`.
- Contact buttons emit `pixel:contact-click` with `{ location, service, channel }`. This is a contact-intent click, not a confirmed lead or sale.
- The Ara architecture example is clearly labeled as a fictional design concept, not a client project.
- The architecture photo is generated with the built-in image generation tool and stored at `public/images/interior.webp`. Prompt: “Photorealistic contemporary living room, walnut panels, off-white sofa, travertine table, garden windows and soft natural daylight; editorial architectural photography; no text, logos or people.”

## Verification

`npm test` checks the production preview with Chromium: four viewport widths, console errors, agent selection, RTL keyboard navigation, WhatsApp messages, FAQ, mobile menu, sticky CTA, static HTML without JavaScript, and axe accessibility checks. Set `PIXEL_TEST_URL` to override the preview URL and `PIXEL_BROWSER_PATH` to override the Chrome executable path (defaults to the standard Windows installation). Reports and screenshots are written to `outputs/`.

The project is a local review build; the existing live domain has not been replaced.

## CRM and request intake

The repository also contains two isolated additions:

- `request/` is a statically rendered, progressively enhanced public request form included in the existing site build.
- `crm/` is a separate React/Vite application whose output is `crm/dist/` and is intended for the separate `crm.pxlgrid.design` Vercel project.

```sh
npm run build
npm run build:crm
npm run preview:crm -- --port 4174
npm run test:request
npm run test:crm
```

Supabase migrations, RLS tests and Edge Functions live under `supabase/`. See `docs/crm-setup.md` for environment setup, first-admin bootstrap, secrets, deployment and rollout checks.
