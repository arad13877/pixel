import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const html = await readFile(new URL('../dist/web-design-restaurant-gorgan/index.html', import.meta.url), 'utf8');
assert.match(html, /<h1[^>]*>طراحی سایت برای رستوران‌های گرگان<\/h1>/);
assert.match(html, /<title>طراحی سایت برای رستوران‌های گرگان \| طراحی سایت رستوران<\/title>/);
assert.match(html, /https:\/\/pxlgrid\.design\/web-design-restaurant-gorgan\//);
assert.match(html, /آیا امکان نمایش منوی رستوران در سایت وجود دارد؟/);

const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${base}/web-design-restaurant-gorgan/`);
  assert.equal(response.status(), 200);
  assert.equal(await page.title(), 'طراحی سایت برای رستوران‌های گرگان | طراحی سایت رستوران');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('main h1').count(), 1);
  assert.equal(await page.locator('#types .wd-type').count(), 6);
  assert.equal(await page.locator('#features .wd-deliverable').count(), 15);
  assert.equal(await page.locator('.wd-reason').count(), 16);
  assert.equal(await page.locator('#process .wd-step').count(), 5);
  assert.equal(await page.locator('.wd-faq-list details').count(), 8);
  assert.match(decodeURIComponent(await page.locator('#hero-contact').getAttribute('href')), /طراحی سایت رستوران در گرگان/);
  assert.equal(await page.locator('main a[href="tel:+989937825753"]').count(), 2);
  for (const href of ['/web-design-gorgan/', '/web-design-price-gorgan/', '/website-support-gorgan/', '/web-design-company-gorgan/']) {
    assert.equal(await page.locator(`main a[href="${href}"]`).count(), 1);
    assert.equal((await page.request.get(`${base}${href}`)).status(), 200);
  }
  await page.locator('.wd-faq-list summary').first().focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.wd-faq-list details').first().getAttribute('open'), '');
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(scrollWidth <= width, `Horizontal overflow at ${width}: ${scrollWidth}`);
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${base}/web-design-restaurant-gorgan/`);
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo({ top: 1600, behavior: 'instant' }));
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.sticky-contact .button').count(), 1);
  assert.match(decodeURIComponent(await page.locator('.sticky-contact .button').getAttribute('href')), /طراحی سایت رستوران در گرگان/);
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/web-design-restaurant-gorgan/`);
  assert.equal(await staticPage.locator('main h1').innerText(), 'طراحی سایت برای رستوران‌های گرگان');
  assert.equal(await staticPage.locator('.wd-faq-list details').count(), 8);
  await noJs.close();
  assert.deepEqual(errors, []);
  console.log('Restaurant landing: static HTML, CTA, FAQ, RTL, responsive widths, related links and console verified.');
} finally {
  await browser.close();
}
