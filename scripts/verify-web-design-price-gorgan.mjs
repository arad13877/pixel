import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const html = await readFile(new URL('../dist/web-design-price-gorgan/index.html', import.meta.url), 'utf8');
assert.match(html, /<h1[^>]*>قیمت طراحی سایت<br\/>/);
assert.match(html, /هزینه سئو جدا از طراحی سایت است؟/);
assert.match(html, /https:\/\/pxlgrid\.design\/web-design-price-gorgan\//);

const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${base}/web-design-price-gorgan/`);
  assert.equal(response.status(), 200);
  assert.equal(await page.title(), 'قیمت طراحی سایت در گرگان | هزینه طراحی سایت');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('main h1').count(), 1);
  assert.equal(await page.locator('main h1').innerText(), 'قیمت طراحی سایت\nدر گرگان');
  assert.equal(await page.locator('#types .wd-type').count(), 4);
  assert.equal(await page.locator('#plans .pricing-card').count(), 6);
  assert.equal(await page.locator('.pricing-faq-list details').count(), 6);
  assert.equal(await page.locator('#process .wd-step').count(), 7);
  const expected = [
    ['لندینگ تبلیغاتی', '۱۰ میلیون تومان'],
    ['سایت شرکتی', '۲۰ میلیون تومان'],
    ['سایت خدماتی', '۳۰ میلیون تومان'],
    ['وب‌سایت محصول و SaaS', '۲۵ میلیون تومان'],
    ['فروشگاه پایه', '۳۰ میلیون تومان'],
  ];
  for (const [title, price] of expected) {
    const card = page.locator('#plans .pricing-card', { has: page.locator('h3', { hasText: title }) });
    assert.equal(await card.locator('.pricing-card-price strong').innerText(), price);
  }
  assert.match(decodeURIComponent(await page.locator('#hero-contact').getAttribute('href')), /برآورد قیمت طراحی سایت در گرگان/);
  for (const href of ['/web-design-gorgan/', '/web-design-company-gorgan/', '/web-design-doctors-gorgan/']) assert.equal(await page.locator(`main a[href="${href}"]:not(.seo-breadcrumb a)`).count(), 1);
  await page.locator('.pricing-faq-list summary').first().focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.pricing-faq-list details').first().getAttribute('open'), '');
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(scrollWidth <= width, `Horizontal overflow at ${width}: ${scrollWidth}`);
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/web-design-price-gorgan/`);
  assert.equal(await staticPage.locator('main h1').count(), 1);
  assert.equal(await staticPage.locator('#plans .pricing-card').count(), 6);
  await noJs.close();
  assert.deepEqual(errors, []);
  console.log('Gorgan price landing: static HTML, shared prices, CTA, FAQ, RTL, responsive widths and console verified.');
} finally {
  await browser.close();
}
