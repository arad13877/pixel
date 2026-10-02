# Public site publication (Production)

The CRM does not need to be rebuilt for each article. Admin publication updates
the published Supabase snapshot, then a runtime-only GitHub Actions token dispatches
`publish-cpanel.yml` at `codex/cpanel-publication`. The workflow builds published
articles and portfolio entries from `xyhrscvywupxfinwxdup`, validates the artifact,
and uploads only `dist/` through the jailed public-root FTPS account.

## Configuration

Supabase Production Edge Function secrets:

- `PUBLIC_SITE_DEPLOY_MODE=github`
- `PUBLIC_SITE_GITHUB_REF=codex/cpanel-publication`
- `PUBLIC_SITE_GITHUB_TOKEN`: fine-grained token, only this repository, Actions read/write.

GitHub repository Actions secrets:

- `SITE_FTPS_HOST`: certificate-valid cPanel server hostname.
- `SITE_FTPS_USERNAME`: the account restricted to `/home/pxlgridd/public_html`.
- `SITE_FTPS_PASSWORD`: never commit or print it.

The public Supabase publishable key is intentionally not a privileged credential.
No service-role key is passed to GitHub or the public bundle.

`SITE_TURNSTILE_SITE_KEY` is an optional GitHub variable for the public request form;
until configured, WhatsApp remains its fallback. This does not block article publishing.

## Safety and completion

- Pushes to `codex/cpanel-publication` build, validate and upload the public website automatically. Manual dispatch uploads only with `dry_run=false`.
- Concurrent publications are serialized, not canceled halfway through upload.
- Old files are backed up under `.pixel-deploy-backups/<run>-<attempt>/` with Apache access denied.
- Assets go first; HTML afterward; the deployment manifest is uploaded last.
- No broad mirror/delete, no CRM upload, no change to host `.htaccess`, `.well-known`, or PHP configuration.
- Archived managed HTML routes receive a noindex tombstone; previous copies stay in backup.
- Live HTTPS homepage hash and deployment marker are verified after uploading.
- CRM `requested` means GitHub accepted the job, not that the website is live.
  Confirm final success/failure in GitHub Actions. Failed dispatch can be retried from CRM.

The current GitHub dispatch token expires **2026-10-31**. Renew it before that date
and update only the Supabase secret. SMTP, authentication and staging stay separate.

## Recovery

If upload fails, inspect the failing workflow. Do not delete the site root or CRM.
Retained assets keep older pages usable. To roll back, restore only the affected
public files from the denied backup folder, after explicit operator approval.

The registration workflow lives on `master` to satisfy GitHub workflow-dispatch
requirements, but checkout/build uses the independent public-site branch.
