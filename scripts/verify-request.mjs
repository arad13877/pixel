import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const url = process.env.PIXEL_REQUEST_URL || 'http://127.0.0.1:4173/request/';
const executablePath = process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
await mkdir('outputs', { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const report = { viewports: [], errors: [], accessibility: [] };
try {
  for (const width of [360, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: /درباره پروژه/ }).waitFor();
    const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, dir: document.documentElement.dir, overflowing: [...document.querySelectorAll('*')].filter(element => { const box = element.getBoundingClientRect(); return box.left < -1 || box.right > innerWidth + 1; }).slice(0,12).map(element => ({ tag: element.tagName, className: element.className, left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right) })) }));
    if (layout.scrollWidth > width) console.log(JSON.stringify(layout, null, 2));
    assert.ok(layout.scrollWidth <= width, `request overflow at ${width}`);
    assert.equal(layout.dir, 'rtl');
    await page.screenshot({ path: `outputs/request-${width}.png`, fullPage: true });
    report.viewports.push(layout);
    if (width === 1440) {
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      report.accessibility = axe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(node => node.target) }));
      assert.equal(await page.locator('form input[name=name]').count(), 1);
      assert.equal(await page.getByRole('button', { name: /ثبت درخواست/ }).isDisabled(), true);
    }
    await context.close();
  }
  const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noScript = await noScriptContext.newPage();
  await noScript.goto(url);
  assert.ok(await noScript.getByRole('heading', { name: /درباره پروژه/ }).isVisible());
  assert.ok(await noScript.getByRole('link', { name: /واتساپ/ }).first().getAttribute('href'));
  await noScriptContext.close();
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.accessibility, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile('outputs/request-verification.json', JSON.stringify(report, null, 2));
  await browser.close();
}
