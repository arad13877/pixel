import { assertEquals, assertThrows } from 'jsr:@std/assert@1';
import { validateArticlePayload, validSlug } from '../_shared/articles.ts';

const workspace = '00000000-0000-0000-0000-000000000001';
const article = '40000000-0000-0000-0000-000000000001';
const storageUrl = 'https://project.supabase.co';
Deno.env.set('SUPABASE_URL', storageUrl);
const payload = {
  slug: 'safe-article', title: 'عنوان معتبر مقاله', excerpt: 'این یک خلاصه معتبر و کافی برای مقاله آزمایشی است.', category: 'راهنما',
  readingMinutesValue: 4, publishedAt: new Date().toISOString(),
  coverData: { kind: 'image', path: `${workspace}/${article}/cover.webp`, url: `${storageUrl}/storage/v1/object/public/article-covers/${workspace}/${article}/cover.webp`, alt: 'کاور مقاله آزمایشی' },
  authorName: 'تحریریه پیکسل', authorSubtitle: 'راهنمای عملی برای تصمیم بهتر', seoTitle: 'عنوان معتبر مقاله | پیکسل', seoDescription: 'این یک توضیح سئو معتبر و کافی برای مقاله آزمایشی است.', ogDescription: 'این یک توضیح شبکه اجتماعی معتبر و کافی برای مقاله است.',
  ctaTitle: 'قدم بعدی را شروع کنید', ctaText: 'برای بررسی نیاز واقعی کسب‌وکار با تیم پیکسل گفتگو کنید.', ctaLabel: 'شروع گفتگو', ctaService: 'طراحی سایت',
  sections: [{ id: 'first-section', title: 'بخش نخست', paragraphs: ['این پاراگراف محتوای معتبر مقاله آزمایشی است.'] }], sources: [],
};

Deno.test('valid article payload is normalized without accepting HTML', () => {
  const result = validateArticlePayload(payload, workspace, article);
  assertEquals(result.ctaLocation, 'article-safe-article-cta');
  assertEquals(result.sections.length, 1);
});
Deno.test('HTML and invalid slugs are rejected', () => {
  assertThrows(() => validSlug('Bad Slug'));
  assertThrows(() => validateArticlePayload({ ...payload, title: '<script>alert(1)</script>' }, workspace, article));
});
Deno.test('cover path must belong to workspace and article', () => {
  assertThrows(() => validateArticlePayload({ ...payload, coverData: { ...payload.coverData, path: 'other/path.webp' } }, workspace, article));
  assertThrows(() => validateArticlePayload({ ...payload, coverData: { ...payload.coverData, url: 'https://example.com/cover.webp' } }, workspace, article));
});
