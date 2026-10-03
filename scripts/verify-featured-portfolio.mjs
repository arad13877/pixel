import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.PIXEL_BASE_URL || 'http://127.0.0.1:4173';
const paths = ['/', '/web-design/', '/web-design-gorgan/', '/web-design-doctors-gorgan/', '/web-design-company-gorgan/', '/web-design-restaurant-gorgan/', '/web-design-price-gorgan/', '/website-support-gorgan/', '/pricing/', '/seo/', '/seo-gorgan/', '/free-website-audit/'];
const links = ['/portfolio/roma/', '/portfolio/gorgan-khaneh/'];
const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const path of paths) {
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, path);
      const section = page.locator('#featured-projects');
      assert.equal(await section.count(), 1, path);
      await section.scrollIntoViewIfNeeded();
      assert.equal(await section.locator('article').count(), 2);
      assert.equal(await section.locator('h3').count(), 2);
      assert.equal(await section.locator('.portfolio-demo-badge').count(), 2);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path}: overflow at ${width}`);
      for (const link of links) assert.equal(await section.locator(`a.portfolio-project-visual[href="${link}"]`).count(), 1);
      await page.waitForFunction(() => [...document.querySelectorAll('#featured-projects img')].every(img => img.complete && img.naturalWidth > 0));
      const boxes = await section.locator('article').evaluateAll(nodes => nodes.map(node => ({ x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y })));
      assert.ok(width > 760 ? Math.abs(boxes[0].y - boxes[1].y) < 2 : Math.abs(boxes[0].x - boxes[1].x) < 2);
    }
    const a11y = await new AxeBuilder({ page }).include('#featured-projects').analyze();
    assert.deepEqual(a11y.violations.map(item => item.id), [], path);
    const html = await (await fetch(`${base}${path}`)).text();
    for (const link of links) assert.ok(html.includes(`href="${link}"`), `${path}: static link missing`);
    console.log(`PASS ${path}: four widths, two demos, lazy images, static HTML and accessibility.`);
  }
  for (const link of links) assert.equal((await page.goto(`${base}${link}`, { waitUntil: 'domcontentloaded' })).status(), 200);
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
