import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const html = await readFile(new URL('../dist/web-design-company-gorgan/index.html', import.meta.url), 'utf8');
assert.match(html, /<h1[^>]*>طراحی سایت شرکتی در گرگان<\/h1>/);
assert.match(html, /هزینه طراحی سایت شرکتی در گرگان چقدر است؟/);
assert.match(html, /href="https:\/\/pxlgrid\.design\/web-design-company-gorgan\/"/);

const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${base}/web-design-company-gorgan/`);
  assert.equal(response.status(), 200);
  assert.equal(await page.title(), 'طراحی سایت شرکتی در گرگان | طراحی سایت شرکت');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('main h1').count(), 1);
  assert.equal(await page.locator('.wd-type').count(), 10);
  assert.equal(await page.locator('.wd-deliverable').count(), 13);
  assert.equal(await page.locator('.wd-step').count(), 5);
  assert.equal(await page.locator('.wd-faq-list details').count(), 7);
  assert.match(decodeURIComponent(await page.locator('#hero-contact').getAttribute('href')), /طراحی سایت شرکتی در گرگان/);
  assert.equal(await page.locator('main a[href="tel:+989937825753"]').count(), 2);
  assert.equal(await page.locator('main a[href="/web-design-gorgan/"]').count(), 1);
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
  await page.goto(`${base}/web-design-company-gorgan/`);
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await page.waitForTimeout(250);
  assert.equal(await page.locator('.sticky-contact .button').count(), 1);
  assert.match(decodeURIComponent(await page.locator('.sticky-contact .button').getAttribute('href')), /طراحی سایت شرکتی در گرگان/);
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/web-design-company-gorgan/`);
  assert.equal(await staticPage.locator('main h1').innerText(), 'طراحی سایت شرکتی در گرگان');
  assert.equal(await staticPage.locator('.wd-faq-list details').count(), 7);
  await noJs.close();
  assert.deepEqual(errors, []);
  console.log('Corporate landing: static HTML, CTA, FAQ, RTL, responsive widths and console verified.');
} finally {
  await browser.close();
}
