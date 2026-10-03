# SEO implementation — 2026-10-03

## Changes ready for publication

- `/pricing/` retains the complete six-plan comparison and shared prices.
- `/web-design-price-gorgan/` becomes a scoped cost guide: local project scenarios,
  a quote checklist, phased budgeting and links to the plan comparison. It no
  longer repeats the full pricing cards. Both URLs retain their self-canonicals.
- Gorgan, doctor, company, restaurant and support pages explain distinct input
  requirements, scope boundaries and responsibilities. No address, client result,
  guaranteed ranking or response-time commitment was invented.
- Contextual links connect the cost article, pricing, local cost, support and free
  audit pages. Existing SEO service pages are preserved.
- Lead forms give an actionable error before any network submission if the
  Turnstile token is missing. Existing server-side verification and rate limits
  remain in place.

## Verification

- Production CMS build: 3 published articles and 4 portfolio demos.
- SEO validator: 18 indexable pages, 4 noindex demos, 18 Sitemap URLs.
- Browser regression: 22 routes at 360, 390, 768 and 1440 pixels; static content
  without JavaScript; no overflow or hydration errors.
- Pricing and local cost tests pass; ten negative SEO validation tests pass;
  public artifact credentials and production project checks pass.
- `scripts/verify-lead-forms.mjs` verifies both configured forms using an isolated
  localhost build and intercepted requests: token required, server error retains
  inputs, successful retry resets form. No test lead was sent to production.

Example fixture invocation (only after building a separate checkout with the
public Turnstile test sitekey, never the deployment checkout):

```powershell
$env:PIXEL_LEAD_FIXTURE_URL = 'http://127.0.0.1:4181'
node scripts/verify-lead-forms.mjs
```

## Real Lighthouse measurements before publication

Chrome headless, Lighthouse 12.8.2, default mobile simulated throttling. These are
single lab runs, not field Core Web Vitals or a measured INP.

| URL | Performance | LCP | TBT | CLS |
| --- | --- | --- | --- | --- |
| `/` | 99 | 1.3 s | 0 ms | 0.073 |
| `/web-design-price-gorgan/` | 99 | 1.5 s | 10 ms | 0.051 |

Local raw reports: `outputs/seo/lighthouse-before-mobile.json` and
`outputs/seo/lighthouse-price-before-mobile.json`. No performance rewrite was
justified by these results.

## Remaining dependency: production Turnstile

The public publication workflow reads GitHub Actions repository variable
`SITE_TURNSTILE_SITE_KEY` into `VITE_TURNSTILE_SITE_KEY` at build time. The
production Supabase secret list currently has no `TURNSTILE_SECRET_KEY`.
`submit-lead` is active with its existing public endpoint configuration, rate
limiting and server verification. Neither bot verification nor RLS was weakened.

To enable both forms:

1. Access the owner's Cloudflare Turnstile dashboard and select or create a widget
   permitting the actual `pxlgrid.design` hostname.
2. Set the **public sitekey** as GitHub Actions variable
   `SITE_TURNSTILE_SITE_KEY` in `arad13877/pixel`.
3. Store the paired **secret key** only as Supabase Edge Function secret
   `TURNSTILE_SECRET_KEY` in production project `xyhrscvywupxfinwxdup`.
4. Rebuild through the existing publication workflow. Verify the real widget and
   one clearly identified end-to-end test with the owner's contact information.
5. Confirm the submission in CRM. Do not report forms as enabled until this is
   verified. Do not deploy Cloudflare dummy test keys to production.

## Search Console inspection

Domain property `sc-domain:pxlgrid.design` is accessible. The aggregate Page
indexing report is still processing. The inspected `/web-design-gorgan/` URL was
unknown to Google before publication; this alone does not prove a crawl block.
Request indexing only after the updated live HTML is verified. Requests are not
a guarantee of indexing or ranking.
