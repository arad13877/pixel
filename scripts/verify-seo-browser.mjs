import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { publicPages, demoPaths } from '../src/seo.ts';
import { articles } from '../src/articles.generated.ts';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4174';
const paths = [...publicPages.map(page => page.path), ...articles.map(article => `/articles/${article.slug}/`), ...demoPaths];
const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report = { routes: [], errors: [], noJs: [], images: [] };
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(`${page.url()}: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(`${page.url()}: ${message.text()}`); });
  for (const path of paths) {
    const response = await page.goto(base + path, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, path);
    assert.equal(await page.locator('h1').count(), 1, path);
    assert.equal(await page.locator('h1').isVisible(), true, path);
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${path} at ${width}`);
    }
    const imageState = await page.evaluate(() => [...document.images].map(image => ({ src: image.currentSrc, missingAlt: !image.hasAttribute('alt'), missingSize: !image.hasAttribute('width') || !image.hasAttribute('height'), broken: image.complete && image.naturalWidth === 0 })));
    assert.ok(imageState.every(image => !image.broken && !image.missingAlt && !image.missingSize), `image metadata/loading ${path}`);
    report.images.push({ path, images: imageState });
    if (path === '/') {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByRole('button', { name: 'باز کردن منو' }).click();
      assert.ok(await page.locator('#mobile-menu').isVisible());
      await page.keyboard.press('Escape');
      await page.getByRole('tab', { name: 'ایجنت فروش', exact: true }).click();
      assert.equal(await page.getByRole('tab', { name: 'ایجنت فروش', exact: true }).getAttribute('aria-selected'), 'true');
    }
    report.routes.push(path);
    console.log(`PASS browser ${path}`);
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  for (const path of paths) {
    const response = await staticPage.goto(base + path);
    assert.equal(response.status(), 200);
    assert.equal(await staticPage.locator('h1').isVisible(), true, `no-JS ${path}`);
    if (!demoPaths.includes(path)) assert.ok(await staticPage.locator('link[rel="canonical"]').getAttribute('href'));
    assert.ok(await staticPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no-JS overflow ${path}`);
    report.noJs.push(path);
  }
  assert.deepEqual(report.errors, [], 'console/hydration errors');
  await mkdir('outputs/seo', { recursive: true });
  await writeFile('outputs/seo/browser-validation.json', JSON.stringify(report, null, 2));
  console.log(`PASS: ${paths.length} routes, four viewport widths, all no-JS pages, menu/tabs, no hydration errors.`);
} finally { await browser.close(); }
