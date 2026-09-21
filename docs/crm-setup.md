# راه‌اندازی CRM پیکسل

CRM یک build مستقل است. خروجی سایت عمومی از `dist/` و خروجی CRM از `crm/dist/` منتشر می‌شود. پروژه production و staging باید به پروژه‌های Supabase جدا متصل شوند؛ staging هرگز نباید کلید یا URL دیتابیس production را دریافت کند.

## محیط محلی

1. Docker Desktop و Supabase CLI را آماده کنید.
2. `npx supabase start` و سپس `npx supabase db reset` را اجرا کنید.
3. فقط متغیرهای عمومی زیر را در `.env.local` قرار دهید:

```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=کلید-publishable-محلی
VITE_TURNSTILE_SITE_KEY=کلید-site-محلی
```

کلید `service_role` نباید با پیشوند `VITE_` یا در Vercel Frontend ذخیره شود.

## ساخت نخستین مدیر

ابتدا کاربر را از داشبورد Supabase Auth دعوت کنید. پس از ساخته‌شدن کاربر، UUID او را جایگزین کنید و این SQL را یک‌بار در محیط موردنظر اجرا کنید:

```sql
insert into public.workspace_members(workspace_id, user_id, role, is_active, invited_at)
values (
  '00000000-0000-0000-0000-000000000001',
  '<AUTH_USER_UUID>',
  'admin',
  true,
  now()
)
on conflict (workspace_id, user_id)
do update set role = 'admin', is_active = true, deactivated_at = null;
```

پس از آن دعوت‌های بعدی فقط از صفحه «تیم» انجام می‌شوند.

## Auth، SMTP و Edge Functions

- ورود self-service را در هر دو پروژه Supabase غیرفعال نگه دارید؛ فقط `inviteUserByEmail` عضو می‌سازد.
- در Data API هر پروژه فقط schema `public` و فقط جدول‌های CRM موردنیاز را expose کنید. جدول `private.submission_rate_limits` هرگز نباید expose شود. grantهای migration عمداً صریح‌اند و به auto-exposure تکیه نمی‌کنند.
- Site URL production: `https://crm.pxlgrid.design`؛ Site URL staging را روی دامنه staging CRM بگذارید.
- Redirect URLها: callback محلی، callback دقیق staging و `https://crm.pxlgrid.design/auth/callback`. از wildcard عمومی استفاده نکنید.
- پیش از production، SMTP اختصاصی فعال شود.
- secretهای Functions: `TURNSTILE_SECRET_KEY`، `RATE_LIMIT_SALT` و `ALLOWED_ORIGINS`. مقدار آخر باید فقط originهای همان محیط باشد؛ نمونه staging: `https://crm-staging.pxlgrid.design,https://pxlgrid-staging.design`.
- متغیرهای داخلی `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` را خود Supabase در runtime فراهم می‌کند و هرگز نباید به Vercel یا bundle مرورگر منتقل شوند.
- `submit-lead` عمومی است؛ سه Function مدیریتی JWT معتبر و نقش admin می‌خواهند.

```sh
npx supabase secrets set TURNSTILE_SECRET_KEY=... RATE_LIMIT_SALT=... ALLOWED_ORIGINS=https://crm-staging.pxlgrid.design,https://pxlgrid-staging.design
npx supabase functions deploy submit-lead --no-verify-jwt
npx supabase functions deploy invite-member
npx supabase functions deploy deactivate-member
npx supabase functions deploy purge-record
npx supabase functions deploy save-article-draft
npx supabase functions deploy publish-article
npx supabase functions deploy archive-article
npx supabase functions deploy retry-article-deploy
```

## Vercel

برای CRM یک پروژه جدا بسازید که Root Directory آن `crm` است:

- پیکربندی build، rewrite و headerها در `crm/vercel.json` است.
- Output directory: `dist`
- Environment: فقط سه متغیر public موجود در `.env.example`

سایت عمومی همچنان با `npm run build` و خروجی `dist/` منتشر می‌شود. مسیر `/request/` جزئی از همین artifact است.

## کنترل انتشار

1. migration را روی Supabase staging اجرا کنید.
2. `npx supabase test db`، سپس `deno test --allow-env --allow-net supabase/functions/tests/` و advisorهای Security/Performance را اجرا کنید.
3. buildهای `npm run build` و `npm run build:crm` را بسازید.
4. تست‌های Playwright/axe و Lighthouse را روی preview اجرا کنید.
5. همان commit تأییدشده را به production ببرید، migration production را اجرا کنید، DNS را متصل و smoke test نهایی را انجام دهید.

این مخزن داده مشتری seed نمی‌کند؛ فقط workspace، پایپ‌لاین و مراحل سیستمی اولیه ساخته می‌شوند.

## فرمان‌های staging

برای مدیریت مقالات، ابتدا در پروژهٔ عمومی Vercel یک Deploy Hook بسازید. مقدار کامل Hook فقط به‌عنوان secret زیر در Supabase ثبت می‌شود و نباید وارد env مرورگر یا مخزن شود:

```sh
npx supabase secrets set PUBLIC_SITE_DEPLOY_HOOK_URL=<VERCEL_PUBLIC_SITE_DEPLOY_HOOK>
```

پروژهٔ عمومی Vercel نیز برای build استاتیک مقالات به متغیرهای `ARTICLE_DATA_MODE=supabase`، `SITE_SUPABASE_URL` و `SITE_SUPABASE_PUBLISHABLE_KEY` نیاز دارد. Preview باید به Supabase staging و Production فقط به Supabase production متصل باشد.

بعد از ساخت یک پروژه Supabase و یک پروژه Vercel مستقل برای staging، از ریشه مخزن اجرا کنید:

```sh
npx supabase login
npx supabase link --project-ref <STAGING_SUPABASE_PROJECT_REF>
npx supabase db push
npx supabase secrets set TURNSTILE_SECRET_KEY=<STAGING_SECRET> RATE_LIMIT_SALT=<LONG_RANDOM_VALUE> ALLOWED_ORIGINS=https://<STAGING_CRM_DOMAIN>,https://<STAGING_PUBLIC_DOMAIN> PUBLIC_SITE_DEPLOY_HOOK_URL=<STAGING_PUBLIC_SITE_DEPLOY_HOOK>
npx supabase functions deploy submit-lead --no-verify-jwt
npx supabase functions deploy invite-member
npx supabase functions deploy deactivate-member
npx supabase functions deploy purge-record
npx supabase functions deploy save-article-draft
npx supabase functions deploy publish-article
npx supabase functions deploy archive-article
npx supabase functions deploy retry-article-deploy

cd crm
vercel link --yes
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY preview
vercel env add VITE_TURNSTILE_SITE_KEY preview
vercel --yes

cd ..
vercel link --yes
vercel env add ARTICLE_DATA_MODE preview
vercel env add SITE_SUPABASE_URL preview
vercel env add SITE_SUPABASE_PUBLISHABLE_KEY preview
vercel --yes
```

مقادیر `preview` باید فقط به پروژه Supabase staging اشاره کنند. قبل از promote، `npx supabase test db`، `deno test --allow-env --allow-net supabase/functions/tests/`، `npm run build`، `npm run build:crm`، `npm test`، `npm run test:request` و `npm run test:crm` را اجرا کنید. CRM عمداً `noindex` است؛ افت امتیاز SEO آن در Lighthouse مورد انتظار است.
