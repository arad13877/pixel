import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report = { routes: [], viewports: [], interactions: [], violations: [], errors: [] };
const articleRoutes = [
  ['why-business-needs-website', 'چرا کسب‌وکار شما به یک سایت حرفه‌ای نیاز دارد؟'],
  ['website-design-cost-guide', 'هزینه طراحی سایت به چه چیزهایی بستگی دارد؟'],
  ['ai-agent-for-business', 'AI Agent چیست و چطور در کارهای واقعی کسب‌وکار کمک می‌کند؟'],
];

try {
  await mkdir('outputs', { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });

  let response = await page.goto(`${base}/articles/`);
  assert.equal(response.status(), 200);
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.title(), 'مقالات طراحی سایت و هوش مصنوعی | مجله پیکسل');
  assert.equal(await page.locator('main h1').count(), 1);
  assert.match(await page.locator('h1').innerText(), /ایده‌هایی برای ساختن کسب‌وکاری/);
  assert.equal(await page.locator('.articles-list .article-card').count(), 3);
  assert.equal(await page.locator('script[type="application/ld+json"]').count(), 1);
  const archiveSchema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert.equal(archiveSchema['@type'], 'ItemList');
  assert.equal(archiveSchema.itemListElement.length, 3);
  const archiveNav = page.getByRole('navigation', { name: 'ناوبری اصلی' });
  assert.equal(await archiveNav.getByRole('link', { name: 'مقالات' }).getAttribute('aria-current'), 'page');
  assert.equal(await archiveNav.getByRole('link', { name: 'مقالات' }).getAttribute('href'), '/articles/');
  assert.equal(await archiveNav.getByRole('link', { name: 'مسیر همکاری' }).count(), 0);

  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.ok(state.scrollWidth <= width, `Archive overflow at ${width}: ${state.scrollWidth}`);
    report.viewports.push({ route: 'articles', ...state });
    if (width === 390 || width === 1440) await page.screenshot({ path: `outputs/articles-${width}.png`, fullPage: true });
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  let axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.violations.push(...axe.violations.map(v => ({ route: 'articles', id: v.id, targets: v.nodes.map(n => n.target) })));

  for (const [slug, title] of articleRoutes) {
    response = await page.goto(`${base}/articles/${slug}/`);
    assert.equal(response.status(), 200);
    assert.equal((await page.locator('h1').innerText()).trim(), title);
    assert.equal(await page.locator('main h1').count(), 1);
    const sectionCount = await page.locator('.article-body > section[id]').count();
    assert.ok(sectionCount >= 8, `${slug} needs at least 8 content sections`);
    assert.equal(await page.locator('.article-toc a').count(), sectionCount);
    assert.equal(await page.locator('.article-sources a').count(), 3);
    assert.equal(await page.locator('.related-articles .article-card').count(), 2);
    assert.match(await page.locator('.article-inline-cta a').getAttribute('href'), /^https:\/\/wa\.me\/989937825753\?text=/);
    const wordCount = (await page.locator('.article-body').innerText()).split(/\s+/).filter(Boolean).length;
    assert.ok(wordCount >= 1000, `${slug} is too short: ${wordCount} words`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    assert.equal(canonical, `https://pxlgrid.design/articles/${slug}/`);
    const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    assert.ok(schema['@graph'].some(item => item['@type'] === 'Article'));
    assert.ok(schema['@graph'].some(item => item['@type'] === 'BreadcrumbList'));
    if (slug === 'why-business-needs-website') await page.screenshot({ path: 'outputs/article-detail-1440.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    const state = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.ok(state.scrollWidth <= 390, `${slug} mobile overflow: ${state.scrollWidth}`);
    report.viewports.push({ route: slug, ...state });
    if (slug === 'why-business-needs-website') await page.screenshot({ path: 'outputs/article-detail-390.png', fullPage: true });
    report.routes.push({ slug, sectionCount, wordCount });
  }

  await page.goto(`${base}/articles/why-business-needs-website/`);
  await page.setViewportSize({ width: 1440, height: 900 });
  const firstToc = page.locator('.article-toc a').first();
  const firstHref = await firstToc.getAttribute('href');
  await firstToc.click();
  assert.equal(new URL(page.url()).hash, firstHref);
  report.interactions.push('Archive links, sticky table of contents, related articles and contextual WhatsApp CTAs work');
  axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.violations.push(...axe.violations.map(v => ({ route: 'article', id: v.id, targets: v.nodes.map(n => n.target) })));

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/articles/ai-agent-for-business/`);
  assert.ok(await staticPage.locator('h1').isVisible());
  assert.ok(await staticPage.locator('.article-body').innerText());
  assert.equal(await staticPage.locator('.article-toc a').count(), await staticPage.locator('.article-body > section[id]').count());
  report.interactions.push('Complete article content and links render without JavaScript');
  await noJs.close();

  const sitemapResponse = await page.request.get(`${base}/sitemap.xml`);
  assert.equal(sitemapResponse.status(), 200);
  const sitemap = await sitemapResponse.text();
  for (const [slug] of articleRoutes) assert.ok(sitemap.includes(`/articles/${slug}/`));
  report.interactions.push('Sitemap includes archive and all article routes');
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.violations, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile('outputs/articles-verification.json', JSON.stringify(report, null, 2));
  await browser.close();
}
