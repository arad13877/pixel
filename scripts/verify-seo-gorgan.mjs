import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.PIXEL_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [];
await mkdir('outputs', { recursive: true });
try {
  for (const width of [360, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await page.goto(`${base}/seo-gorgan/`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('h1').innerText().then(text => text.replace(/\s+/g, ' ')), 'خدمات سئو در گرگان برای رشد کسب‌وکار شما');
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`);
    assert.equal(await page.locator('.wd-type').count(), 5);
    assert.equal(await page.locator('.wd-reason').count(), 5);
    assert.equal(await page.locator('.wd-step').count(), 6);
    assert.equal(await page.locator('.wd-faq-list details').count(), 6);
    assert.equal(await page.locator('.pricing-card-price').count(), 0);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://pxlgrid.design/seo-gorgan/');
    const description = await page.locator('meta[name=description]').getAttribute('content');
    assert.ok(description.length >= 140 && description.length <= 160);
    assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'index, follow');
    const breadcrumb = await page.locator('.seo-breadcrumb li').allTextContents();
    assert.deepEqual(breadcrumb, ['پیکسل', 'خدمات سئو', 'سئو در گرگان']);
    await page.locator('.wd-faq-list details').first().locator('summary').click();
    assert.equal(await page.locator('.wd-faq-list details').first().getAttribute('open'), '');
    if (width === 360) {
      await page.getByRole('button', { name: 'باز کردن منو' }).click();
      assert.equal(await page.locator('#mobile-menu').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#mobile-menu').isVisible(), false);
    }
    if (width === 1440) {
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.deepEqual(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
      const schema = (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap(text => JSON.parse(text)['@graph'] || [JSON.parse(text)]);
      const service = schema.find(item => item['@type'] === 'Service');
      assert.equal(service.areaServed.name, 'گرگان');
      assert.equal(service.url, 'https://pxlgrid.design/seo-gorgan/');
      assert.equal(service.address, undefined);
      assert.equal(service.aggregateRating, undefined);
      assert.deepEqual(schema.find(item => item['@type'] === 'BreadcrumbList').itemListElement.map(item => item.item), ['https://pxlgrid.design/', 'https://pxlgrid.design/seo/', 'https://pxlgrid.design/seo-gorgan/']);
      await page.evaluate(() => document.documentElement.style.fontSize = '200%');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '200% text overflow');
      await page.evaluate(() => document.documentElement.style.fontSize = '');
    }
    await page.screenshot({ path: `outputs/seo-gorgan-${width}.png`, fullPage: true });
    await page.goto(`${base}/seo-gorgan/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `outputs/seo-gorgan-hero-${width}.png` });
    await context.close();
    console.log(`PASS local SEO at ${width}px`);
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${base}/seo-gorgan/`);
  assert.equal(await page.locator('h1').isVisible(), true);
  assert.equal(await page.locator('.wd-step').count(), 6);
  for (const path of ['/seo/', '/free-website-audit/', '/request/', '/pricing/', '/web-design-gorgan/']) assert.ok(await page.locator(`main a[href="${path}"]`).count(), path);
  assert.ok(await page.locator('main a[href^="/articles/"]').count());
  for (const path of ['/seo/', '/web-design-gorgan/']) {
    await page.goto(base + path);
    assert.ok(await page.locator('main a[href="/seo-gorgan/"]').count(), `inbound link ${path}`);
  }
  await context.close();
  assert.ok((await readFile('dist/sitemap.xml', 'utf8')).includes('https://pxlgrid.design/seo-gorgan/'));
  assert.ok(!(await readFile('dist/seo-gorgan/index.html', 'utf8')).includes('<!--app-html-->'));
  assert.deepEqual(errors, []);
  console.log('PASS local SEO: canonical, indexability, schema, static HTML, links, FAQ, accessibility and 200% text.');
} finally { await browser.close(); }
