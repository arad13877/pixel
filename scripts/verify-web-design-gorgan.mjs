import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const result = { viewports: [], errors: [] };
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.on('pageerror', error => result.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') result.errors.push(message.text()); });
  const response = await page.goto(`${base}/web-design-gorgan/`);
  assert.equal(response.status(), 200);
  assert.equal(await page.title(), 'طراحی سایت در گرگان | پیکسل');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('main h1').count(), 1);
  assert.equal(await page.locator('main h1').innerText(), 'طراحی سایت در گرگان');
  assert.equal(await page.locator('.wd-type').count(), 7);
  assert.equal(await page.locator('.wd-deliverable').count(), 8);
  assert.equal(await page.locator('.wd-step').count(), 6);
  assert.equal(await page.locator('.wd-reason').count(), 7);
  assert.equal(await page.locator('.wd-faq-list details').count(), 6);
  assert.equal(await page.locator('main [data-contact-location="web-design-gorgan-hero"]').count(), 1);
  assert.match(decodeURIComponent(await page.locator('#hero-contact').getAttribute('href')), /طراحی سایت در گرگان/);
  assert.equal(await page.getByRole('link', { name: /مشاهده نمونه‌کارها/ }).first().getAttribute('href'), '/portfolio/');
  assert.equal(await page.locator('#gorgan-portfolio-title').innerText(), 'نمونه طراحی سایت');
  assert.equal(await page.locator('.wd-type h3').first().innerText(), 'سایت شرکتی');
  await page.locator('.wd-faq-list summary').first().click();
  assert.equal(await page.locator('.wd-faq-list details').first().getAttribute('open'), '');
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, brokenImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    assert.ok(state.scrollWidth <= width, `Horizontal overflow at ${width}: ${state.scrollWidth}`);
    assert.deepEqual(state.brokenImages, []);
    result.viewports.push(state);
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/web-design-gorgan/`);
  assert.equal(await staticPage.locator('main h1').innerText(), 'طراحی سایت در گرگان');
  assert.equal(await staticPage.locator('.wd-faq-list details').count(), 6);
  await noJs.close();
  assert.deepEqual(result.errors, []);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
