# Manual Apache/cPanel actions

No server, DNS, redirect, compression or cache setting was changed by the SEO work.

1. Back up the public domain's current `.htaccess` in cPanel File Manager (enable Show Hidden Files). Preserve PHP, security and existing application rules.
2. Review `seo-apache.example.conf` and merge its redirect block before existing rewrite rules, then its compression/cache blocks. This is a snippet, not a replacement `.htaccess`.
3. Confirm Apache terminates TLS. If HTTPS terminates at a proxy, have the host adapt the HTTPS condition to its trusted proxy configuration before enabling it, to avoid redirect loops.
4. Keep the rules in `pxlgrid.design`'s document root only. Do not apply them to CRM. Existing DNS/TLS already serves www; no DNS move is required for this redirect.
5. The www redirect and HTTP redirect preserve the complete path and existing query string. The explicit index.html redirect uses THE_REQUEST so internal directory-index resolution is unaffected.
6. The 410 rule applies only to the confirmed retired article. Other retired URLs need individually reviewed rules; the uploader's noindex tombstone remains a fallback until such rules are installed. Never retire the four current Portfolio demos.
7. If Brotli is unavailable, the snippet uses Gzip. Ask the host to enable mod_headers plus mod_brotli or mod_deflate if those modules are unavailable.

Verify GET responses after installing rules:

```powershell
curl.exe -I 'https://www.pxlgrid.design/web-design-gorgan/?utm_source=check'
curl.exe -I 'http://pxlgrid.design/web-design-gorgan/?utm_source=check'
curl.exe -I 'https://pxlgrid.design/index.html?utm_source=check'
curl.exe -I 'https://pxlgrid.design/articles/crm-upload-check-20261001/'
curl.exe -I -H 'Accept-Encoding: br, gzip' 'https://pxlgrid.design/'
```

Expected: www/HTTP → 301 to HTTPS non-www with the same path/query; index.html → 301 to its directory URL; retired test → 410; normal pages → 200. Confirm Content-Encoding on text responses and Cache-Control on an actual current hashed JS/CSS asset. Use `curl.exe -IL` to check the complete redirect chain ends without a loop.

After publishing the reviewed local `dist`, run `npm run validate:seo -- --base-url https://pxlgrid.design` to check deployed sitemap destinations against the local artifact. This does not publish anything. The validation requires HTTP 200, no noindex header/meta and matching Canonical.

## Images intentionally without og:image

The three current articles use CSS preset covers, not an actual raster cover. The articles archive, request, website support and free website audit pages have no dedicated suitable cover asset. Their text Open Graph metadata is complete; no invented image was added. A future real uploaded article image is validated and used in Article schema/Open Graph, with dimensions read from the actual file.
