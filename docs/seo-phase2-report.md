# PHASE 2 — گزارش نهایی

اصلاحات در پروژه و Build محلی انجام شده‌اند. هیچ انتشار، تغییر CMS، تنظیم Apache/cPanel یا تغییر DNS انجام نشده است.

## Fixed

- مقالهٔ `crm-upload-check-20261001` از خروجی عمومی، آرشیو، Sitemap و الزام بسته‌بندی کنار گذاشته شد. مولد عمومی فقط داده‌های Published را می‌خواند و slugهای test/draft/private/staging/preview را فیلتر می‌کند؛ دادهٔ CMS حذف نشده است.
- لینک‌های Home و طراحی سایت به خوشهٔ گرگان، پنج خدمت تخصصی از صفحهٔ گرگان، مسیر برگشت صفحات تخصصی، لینک درخواست پروژه و ارتباط موضوعی Portfolio/مقالات تکمیل شد. تمام صفحات عمومی از Home قابل دسترسی هستند.
- Canonical صریح Home به `https://pxlgrid.design/` اضافه شد. همین HTML برای index.html و query دارای سیگنال Canonical یکسان است؛ Redirect آن‌ها اقدام سرور است.
- metadata متنی Open Graph صفحات عمومی تکمیل شد. فقط تصاویر موجود و متناسب استفاده شدند؛ تصاویر دمو با توضیح کانسپت نمایشی معرفی شده‌اند.
- Breadcrumb بصری و JSON-LD صفحات Local، Organization/WebSite در Home و Service برای طراحی سایت و خدمات Local اضافه شد. Article/BreadcrumbList مقالات حفظ و بررسی شد.
- robots مستقل CRM با Allow ساخته شد؛ HTML همچنان `noindex,nofollow,noarchive` دارد و Sitemap عمومی به CRM کپی نمی‌شود.
- JS صفحات بر اساس نوع صفحه جدا شد. CSS مشترک و CSS مورد نیاز هر صفحه مستقل بارگذاری می‌شوند و HTML بدون JavaScript قابل مشاهده است.
- مشتق‌های WebP با کیفیت ۹۰، srcset، sizes و ابعاد واقعی برای تصاویر موجود ایجاد شد؛ فایل‌های اصلی تصاویر حفظ شدند. preload وزن‌های اضافی فونت حذف شد.
- Heading نمایشی داخل ماکاپ Home به عنصر غیر Heading تبدیل شد، بدون تغییر ظاهر یا H1 اصلی.
- Validation به Build متصل شد: Title، Description، دقیقاً یک H1، Canonical، OG، JSON-LD، Sitemap، robots، لینک/anchor داخلی، قابلیت دسترسی از Home و عدم انتشار مسیرهای خصوصی بررسی می‌شوند. بررسی HTTP محلی بدون SPA fallback، وضعیت ۲۰۰ و نبود noindex را تأیید می‌کند. خطا Build را متوقف می‌کند.

## Not Changed

- URLها، متن اصلی صفحات و مقالات، H1ها، چارچوب، هاست و طراحی اصلی حفظ شدند؛ فقط لینک/Breadcrumb ضروری SEO اضافه شد.
- چهار دمو حذف یا indexable نشدند. دادهٔ CMS، تنظیمات دسترسی CRM و داده‌های کاربران تغییر نکردند.
- تصویر جدید، اطلاعات تجاری ساختگی، LocalBusiness ناقص، Review یا Rating ایجاد نشد.
- صفحهٔ `/free-website-audit/` از کار هم‌زمان دیگر در Workspace موجود بود؛ این مرحله آن را تولید نکرد و فقط خروجی موجود را در موجودی و Validation لحاظ کرد.

## Server Actions Required

فایل `seo-apache.example.conf` فقط نمونهٔ ادغام دستی است و `.htaccess` فعال نیست. دستورالعمل دقیق در `seo-server-actions.md` قرار دارد.

1. از `.htaccess` فعلی دامنهٔ عمومی پشتیبان بگیرید و قواعد را قبل از Rewriteهای فعلی ادغام کنید؛ فایل را کامل جایگزین نکنید و به CRM اعمال نکنید.
2. HTTP/www را با ۳۰۱ به HTTPS non-www بفرستید؛ path و query حفظ می‌شوند.
3. درخواست صریح index.html را با ۳۰۱ به URL پوشه منتقل کنید.
4. فقط مقالهٔ تست کنارگذاشته‌شده را ۴۱۰ کنید. دموها پابرجا می‌مانند.
5. Brotli یا Gzip و Cache-Control منابع hashدار را فعال کنید. HTML/Sitemap قابل بازاعتبارسنجی بمانند.
6. پس از انتشار دستی `dist`، دستور `npm run validate:seo -- --base-url https://pxlgrid.design` و بررسی Redirect/Compression/Cache در راهنما را اجرا کنید.

قواعد Apache روی سرور اجرا یا آزمایش نشده‌اند. اگر TLS در Proxy خاتمه می‌یابد، میزبان باید شرط HTTPS را متناسب کند.

## Build Validation

| بررسی | نتیجه |
|---|---|
| TypeScript `tsc --noEmit` | پاس، داخل Build واقعی |
| Production Build عمومی | پاس؛ ۳ مقاله و ۴ نمونه‌کار Published از CMS |
| Production Build CRM | پاس؛ robots مستقل، بدون Sitemap عمومی |
| Sitemap، Canonical، Metadata، Robots، Indexability | پاس؛ ۱۶ URL و ۴ دمو noindex |
| HTTP محلی Sitemap | تمام ۱۶ مقصد ۲۰۰، بدون Redirect/noindex، Canonical صحیح |
| تست‌های منفی محافظ SEO | ۱۰ تست پاس |
| تست اصلی `npm test` | پاس؛ Home، طراحی سایت، تعرفه، Portfolio، چهار دمو و مقالات |
| تست صفحات تخصصی و Request | پاس؛ CTA/FAQ، responsive، HTML بدون JS و نبود خطای مرورگر |
| مرورگر جامع | ۲۰ مسیر، عرض‌های ۳۶۰/۳۹۰/۷۶۸/۱۴۴۰، همهٔ مسیرها بدون JS، بدون overflow و خطای hydration |
| بررسی Artifact | پاس؛ ۱۱۵ فایل عمومی، بدون فایل حساس یا منبع Staging |
| `git diff --check` | پاس |

فایل‌های نتیجه در `outputs/seo/` هستند. فرمان مرورگر: `$env:PIXEL_TEST_URL='http://127.0.0.1:4174'; node --experimental-strip-types scripts/verify-seo-browser.mjs` با Preview همان پورت.

| سنجش موبایل محلی Lighthouse | Home | مقالهٔ ضرورت داشتن سایت |
|---|---:|---:|
| Performance | ۹۳ | ۹۴ |
| LCP | ۲٫۵۶ ثانیه | ۲٫۵۶ ثانیه |
| CLS | ۰٫۰۸۵ | ۰٫۰۴۸ |
| TBT | ۹ میلی‌ثانیه | ۰ |

این نتایج محیط محلی هستند و جای اندازه‌گیری سایت زنده/CrUX را نمی‌گیرند؛ TBT نیز INP میدانی نیست. JS مشترک برنامه از حدود ۲۴۴٫۶۵ به ۴۶٫۰۶ کیلوبایت کاهش یافت، اما React runtime جداگانه حدود ۲۲۳٫۹۵ کیلوبایت است. CSS مشترک از حدود ۹۸٫۷۷ به ۴۴٫۶۰ کیلوبایت رسید؛ CSS اختصاصی هر صفحه جداست. همهٔ اعداد فایل، قبل از فشرده‌سازی هستند.

## Final URL Inventory

| گروه | تعداد |
|---|---:|
| صفحات عمومی Indexable | ۱۶ = ۱۳ صفحهٔ ثابت + ۳ مقاله |
| صفحات عمومی Noindex | ۴ |
| Portfolio demo pages | ۴؛ همان چهار Noindex بالا |
| CRM | ۱ HTML مستقل؛ همهٔ مسیرها noindex؛ ۲۴ الگوی مسیر مشخص به‌علاوه catch-all |
| Sitemap URLs | ۱۶ |

CRM یک SPA با رکوردهای پویا است؛ تعداد الگوی مسیر، تعداد رکوردها یا URLهای واقعی کاربران نیست. دموها و CRM در Sitemap عمومی نیستند.

مسیرهای Indexable، همگی زیر `https://pxlgrid.design`:

```text
/
/web-design/
/web-design-gorgan/
/web-design-doctors-gorgan/
/web-design-company-gorgan/
/web-design-restaurant-gorgan/
/web-design-price-gorgan/
/website-support-gorgan/
/pricing/
/portfolio/
/request/
/articles/
/free-website-audit/
/articles/why-business-needs-website/
/articles/website-design-cost-guide/
/articles/ai-agent-for-business/
```

چهار مسیر Noindex عمومی:

```text
/portfolio/nilora/
/portfolio/veloma/
/portfolio/roma/
/portfolio/zero-line/
```

## Remaining Issues

1. اولویت بالا: انتشار دستی خروجی جدید، Redirect دامنه/index.html و وضعیت ۴۱۰ مقالهٔ تست؛ سایت زنده هنوز اصلاحات محلی را دریافت نکرده است.
2. اولویت بالا: فعال‌سازی Compression و Cache در Apache؛ سپس تکرار Lighthouse زنده و بررسی Core Web Vitals میدانی. LCP محلی نزدیک مرز ۲٫۵ ثانیه است.
3. اولویت متوسط: تصویر مناسب اختصاصی برای Request، Support، Articles archive و Free Audit موجود نیست. سه مقاله کاور CSS دارند؛ `og:image` ساختگی اضافه نشد. مسیر استفاده از کاور واقعی آینده آماده است، ولی این Build مقاله با کاور فایل تصویری ندارد.
4. خارج از اصلاحات SEO: فرم عمومی در Build بررسی‌شده به علت نبود تنظیم معتبر Production برای Turnstile غیرفعال است؛ مسیر تماس واتساپ موجود و تست‌شده است.

## Google Search Console — Next Step

این مراحل را بعد از انتشار و تأیید HTTP زنده انجام دهید:

1. Property موجود `pxlgrid.design` را استفاده کنید؛ اگر ندارید، Domain Property را با رکورد DNS ارائه‌شدهٔ خود Google تأیید کنید. این پروژه DNS را تغییر نداده است. [راهنمای تأیید مالکیت](https://support.google.com/webmasters/answer/9008080?hl=en)
2. در Sitemaps، `https://pxlgrid.design/sitemap.xml` را Submit کنید؛ انتظار ۱۶ URL مطابق این Build است. [راهنمای Google برای Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
3. Home، طراحی سایت، گرگان، پنج خدمت Local و مقالات موجود را با URL Inspection بررسی کنید: Test Live URL، دسترسی Crawl و Canonical را کنترل و برای صفحات اصلی به‌روزشده Request Indexing بزنید. برای کل مجموعه Sitemap کافی است؛ درخواست Indexing تضمین ایندکس نیست. [راهنمای URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en)
4. پس از Crawl مجدد، Google-selected canonical را با HTTPS non-www مقایسه کنید. خروج دموها/CRM به علت noindex و مقالهٔ کنارگذاشته‌شده به علت ۴۱۰ مطلوب است؛ آن‌ها را برای Indexing درخواست نکنید.
5. Page Indexing، HTTPS و Core Web Vitals را بررسی کنید؛ برای ایرادهای قبلی فقط پس از تأیید رفع زنده Validate Fix را اجرا کنید. اعداد میدانی بلافاصله با Build محلی تغییر نمی‌کنند.

PHASE 2 پایان یافته است؛ مرحلهٔ بعدی آغاز نشده است.
