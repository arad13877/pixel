import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const html = await readFile(new URL('../dist/website-support-gorgan/index.html', import.meta.url), 'utf8');
assert.match(html, /<h1[^>]*>پشتیبانی سایت در گرگان<\/h1>/);
assert.match(html, /هزینه پشتیبانی سایت در گرگان چقدر است؟/);
assert.match(html, /https:\/\/pxlgrid\.design\/website-support-gorgan\//);

const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${base}/website-support-gorgan/`);
  assert.equal(response.status(), 200);
  assert.equal(await page.title(), 'پشتیبانی سایت در گرگان | نگهداری و توسعه سایت');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('main h1').count(), 1);
  assert.equal(await page.locator('#types .wd-type').count(), 6);
  assert.equal(await page.locator('.wd-reason').count(), 6);
  assert.equal(await page.locator('#process .wd-step').count(), 5);
  assert.equal(await page.locator('.wd-deliverable').count(), 6);
  assert.equal(await page.locator('.wd-faq-list details').count(), 7);
  assert.match(decodeURIComponent(await page.locator('#hero-contact').getAttribute('href')), /پشتیبانی سایت در گرگان/);
  assert.equal(await page.locator('main a[href="tel:+989937825753"]').count(), 1);
  for (const href of ['/web-design-gorgan/', '/web-design-price-gorgan/', '/web-design-company-gorgan/', '/web-design-doctors-gorgan/']) assert.equal(await page.locator(`main a[href="${href}"]`).count(), 1);
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
  await page.goto(`${base}/website-support-gorgan/`);
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await page.waitForTimeout(250);
  assert.equal(await page.locator('.sticky-contact .button').count(), 1);
  assert.match(decodeURIComponent(await page.locator('.sticky-contact .button').getAttribute('href')), /پشتیبانی سایت در گرگان/);
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/website-support-gorgan/`);
  assert.equal(await staticPage.locator('main h1').innerText(), 'پشتیبانی سایت در گرگان');
  assert.equal(await staticPage.locator('.wd-faq-list details').count(), 7);
  await noJs.close();
  assert.deepEqual(errors, []);
  console.log('Support landing: static HTML, CTA, FAQ, RTL, responsive widths, related links and console verified.');
} finally {
  await browser.close();
}
