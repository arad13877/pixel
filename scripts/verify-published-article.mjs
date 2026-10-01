import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';

const slug = 'crm-upload-check-20261001';
const route = `/articles/${slug}/`;
const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => console.error('Request failed:', request.url(), request.failure()?.errorText));
  page.on('console', message => { if(message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  assert.match(await page.locator('h1').innerText(), /آزمون فنی ذخیره مقاله/);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://pxlgrid.design${route}`);
  const image = page.locator('.article-cover img');
  assert.equal(await image.count(), 1);
  assert.match(await image.getAttribute('src'), /^https:\/\/xyhrscvywupxfinwxdup\.supabase\.co\/storage\//);
  await image.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const cover = document.querySelector('.article-cover img');
    return cover?.complete && cover.naturalWidth > 0;
  });
  assert.ok(await image.evaluate(element => element.complete && element.naturalWidth > 0));
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(audit.violations, []);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: `outputs/site-production/article-publication-${process.env.PIXEL_TEST_URL ? 'live' : 'preview'}.jpg`, fullPage: true });
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}${route}`);
  assert.match(await staticPage.locator('.article-body').innerText(), /پیش‌نویس آزمایشی/);
  const sitemap = process.env.PIXEL_TEST_URL ? await (await context.request.get(`${base}/sitemap.xml`)).text() : await readFile('dist/sitemap.xml', 'utf8');
  assert.match(sitemap, new RegExp(slug));
  assert.ok((await staticPage.content()).includes('application/ld+json'));
  console.log('PASS: new published article, Production cover, SSR/no-JS, canonical/JSON-LD/sitemap, mobile and axe.');
} finally { await browser.close(); }
