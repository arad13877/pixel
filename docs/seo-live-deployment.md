# SEO: verified Production deployment — 2026-10-02

The public SEO release is live at https://pxlgrid.design/.

- Release commit: `76dff6819428a94b086a9a00c984ed4f150f7265`.
- Successful GitHub Actions run: https://github.com/arad13877/pixel/actions/runs/37006739131 (8m 28s).
- The public deployment marker confirms this commit and run `37006739131-1`.
- Production TypeScript/build, SEO artifact validation and all 10 SEO regression tests passed in GitHub Actions before upload.
- All 16 sitemap destinations passed live HTTP 200, Canonical and indexability validation.

## Automatic publication

Public site changes must be committed and pushed to `codex/cpanel-publication`.
The existing `publish-cpanel.yml` builds published CMS data, validates SEO, backs up
overwritten public files and uploads the new website automatically through FTPS.
No manual ZIP upload is needed. A failed Build prevents upload; check the final
GitHub Actions result, rather than treating a successful push as deployment success.
CRM deployment remains separate.

The current development checkout was preserved on `codex/username-login` because
it contains other unfinished work. This release was created from the current
publication branch using a separate Git index; unrelated work was not overwritten.

## Host configuration applied and verified

The public `.htaccess` now contains the reviewed SEO rules, alongside the original
cPanel PHP configuration. Existing application and security settings were preserved.

| Check | Verified live result |
|---|---|
| HTTPS www → non-www | 301, same path and query |
| HTTP primary domain → HTTPS primary domain | 301, same path and query |
| Explicit index.html | 301 to directory URL, query preserved |
| Retired `/articles/crm-upload-check-20261001/` | 410 |
| Retired `/articles/test/` | 410; discovered as an old noindex tombstone in the previous deployment manifest |
| HTML and JavaScript compression | Gzip; JavaScript MIME `text/javascript` explicitly included |
| Hashed assets | `public, max-age=31536000, immutable` |
| HTML/Sitemap | `no-cache` |
| Four Portfolio demos | HTTP 200, noindex |
| CRM login | HTTP 200 with `noindex, nofollow, noarchive` header |
| CRM robots | Allow crawl, no public Sitemap declaration |
| CRM sitemap.xml | Old XML moved out of document root; explicit HTTP 404 prevents SPA fallback returning 200 |

HTTP on www may first receive cPanel's existing HTTPS redirect before the non-www
redirect; the chain ends at the canonical URL. HTTPS www redirects directly.

The old CRM XML and original settings are recoverable outside both document roots:

```text
/home/pxlgridd/.htaccess-seo-backup-20261002
/home/pxlgridd/.crm-htaccess-seo-backup-20261002
/home/pxlgridd/.crm-robots-seo-backup-20261002.txt
/home/pxlgridd/.crm-sitemap-seo-backup-20261002.xml
```

The separate CRM rules are retained in `crm/cpanel.htaccess` for future CRM packages.
Public automatic publication deliberately preserves host `.htaccess`.

The final checked HTTP results are saved locally in `outputs/seo/live-validation.json`.
This document supplements `seo-phase2-report.md`, which recorded the state before publication.
