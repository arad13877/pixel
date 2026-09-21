import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { articles as fixtures, type ArticleRecord } from '../src/articles.ts';

type PublishedRow = {
  slug: string;
  published_payload: ArticleRecord;
  published_at: string | null;
  updated_at: string;
  sort_order: number;
};

const root = resolve(import.meta.dirname, '..');
const generatedRoot = resolve(root, '.generated/articles');
const outputModule = resolve(root, 'src/articles.generated.ts');
const mode = process.env.ARTICLE_DATA_MODE || 'fixture';
if (process.env.VERCEL_ENV === 'production' && mode !== 'supabase') throw new Error('Production builds require ARTICLE_DATA_MODE=supabase');
const fixtureSeo: Record<string, { title: string; description: string; og: string }> = {
  'why-business-needs-website': { title: 'چرا کسب‌وکار شما به سایت حرفه‌ای نیاز دارد؟ | پیکسل', description: 'سایت حرفه‌ای چگونه به اعتماد، دیده‌شدن و ارتباط بهتر با مشتری کمک می‌کند؟ راهنمای عملی برای کسب‌وکارهایی که هنوز سایت ندارند.', og: 'راهنمای عملی اعتماد، دیده‌شدن و تبدیل بازدیدکننده به ارتباط واقعی.' },
  'website-design-cost-guide': { title: 'هزینه طراحی سایت به چه چیزهایی بستگی دارد؟ | پیکسل', description: 'عوامل واقعی تعیین‌کننده هزینه طراحی سایت، روش مقایسه پیشنهادها و چک‌لیست تصمیم‌گیری پیش از شروع پروژه.', og: 'راهنمای شفاف عوامل هزینه و مقایسه پیشنهادهای طراحی سایت.' },
  'ai-agent-for-business': { title: 'AI Agent چیست و چه کمکی به کسب‌وکار می‌کند؟ | پیکسل', description: 'AI Agent چگونه با ابزارها کار می‌کند، چه تفاوتی با چت‌بات دارد و چطور یک فرایند مناسب و قابل‌اندازه‌گیری برای شروع انتخاب کنیم؟', og: 'راهنمای کاربرد، محدودیت و مسیر درست شروع یک AI Agent.' },
};

function normalize(article: ArticleRecord, row?: PublishedRow): ArticleRecord {
  const publishedAt = row?.published_at || article.publishedAt;
  const seo = fixtureSeo[article.slug];
  return {
    ...article,
    slug: row?.slug || article.slug,
    publishedAt,
    publishedLabel: new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle: 'long', timeZone: 'Asia/Tehran' }).format(new Date(publishedAt)),
    modifiedAt: article.modifiedAt || row?.updated_at || publishedAt,
    authorName: article.authorName || 'تحریریه پیکسل',
    authorSubtitle: article.authorSubtitle || 'راهنمای عملی برای تصمیم بهتر',
    seoTitle: article.seoTitle || seo?.title || `${article.title} | پیکسل`,
    seoDescription: article.seoDescription || seo?.description || article.excerpt,
    ogDescription: article.ogDescription || seo?.og || article.excerpt,
    coverData: article.coverData || { kind: 'preset', preset: article.cover },
  };
}

async function loadArticles() {
  if (mode !== 'supabase') return fixtures.map(article => normalize(article));
  const url = process.env.SITE_SUPABASE_URL;
  const key = process.env.SITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('ARTICLE_DATA_MODE=supabase requires SITE_SUPABASE_URL and SITE_SUPABASE_PUBLISHABLE_KEY');
  const endpoint = new URL('/rest/v1/articles', url);
  endpoint.searchParams.set('select', 'slug,published_payload,published_at,updated_at,sort_order');
  endpoint.searchParams.set('status', 'eq.published');
  endpoint.searchParams.set('archived_at', 'is.null');
  endpoint.searchParams.set('order', 'sort_order.asc,published_at.desc');
  const response = await fetch(endpoint, { headers: { apikey: key, authorization: `Bearer ${key}` } });
  if (!response.ok) throw new Error(`Published article fetch failed (${response.status}): ${await response.text()}`);
  const rows = await response.json() as PublishedRow[];
  if (!Array.isArray(rows)) throw new Error('Published article response is not an array');
  if (process.env.VERCEL_ENV === 'production' && rows.length === 0) throw new Error('Production article build received no published articles');
  return rows.map(row => normalize(row.published_payload, row));
}

function pageShell(slug: string) {
  return `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><meta name="theme-color" content="#f6f8fc"/><!--article-meta--><link rel="preload" href="/src/fonts/Modam-Regular.woff" as="font" type="font/woff" crossorigin/><link rel="preload" href="/src/fonts/Modam-SemiBold.woff" as="font" type="font/woff" crossorigin/><link rel="preload" href="/src/fonts/Modam-Bold.woff" as="font" type="font/woff" crossorigin/><link rel="preload" href="/src/fonts/Modam-ExtraBold.woff" as="font" type="font/woff" crossorigin/><link rel="icon" type="image/svg+xml" href="/favicon.svg"/></head><body><div id="root" data-page="article" data-article-slug="${slug}"><!--app-html--></div><script type="module" src="/src/main.tsx"></script></body></html>`;
}

const articles = await loadArticles();
await rm(generatedRoot, { recursive: true, force: true });
await mkdir(generatedRoot, { recursive: true });
for (const article of articles) {
  const folder = resolve(generatedRoot, article.slug);
  await mkdir(folder, { recursive: true });
  await writeFile(resolve(folder, 'index.html'), pageShell(article.slug), 'utf8');
}

const serialized = JSON.stringify(articles, null, 2);
await writeFile(outputModule, `import type { ArticleRecord } from './articles';\nexport type { ArticleRecord, ArticleSection, ArticleSource } from './articles';\nexport const articles: ArticleRecord[] = ${serialized};\nexport function getArticle(slug?: string) { return articles.find(article => article.slug === slug) ?? articles[0]; }\n`, 'utf8');
console.log(`Prepared ${articles.length} published article page(s) from ${mode}.`);
