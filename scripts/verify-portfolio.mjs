import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true });
const report = { viewports: [], links: [], violations: [], errors: [] };

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
  await page.goto(`${base}/portfolio/`);
  await page.evaluate(() => document.fonts.ready);
  assert.match(await page.title(), /نمونه‌کارها \| پیکسل/);
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.ok(await page.getByRole('heading', { level: 1, name: 'جایی برای تجربه‌های واقعی.' }).isVisible());
  assert.ok(await page.getByText('فعلاً نمونه‌کاری برای نمایش عمومی نداریم.', { exact: false }).isVisible());

  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const state = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.ok(state.scrollWidth <= width, `Horizontal overflow at ${width}`);
    report.viewports.push(state);
  }

  const nav = page.getByRole('navigation', { name: 'ناوبری اصلی' });
  assert.equal(await nav.getByRole('link', { name: 'نمونه‌کارها' }).getAttribute('aria-current'), 'page');
  assert.equal(await nav.getByRole('link', { name: 'طراحی سایت' }).getAttribute('href'), '/web-design/');
  assert.equal(await nav.getByRole('link', { name: /ایجنت‌های هوش مصنوعی/ }).getAttribute('href'), '/#agents');
  assert.equal(await nav.getByRole('link', { name: 'مقالات' }).getAttribute('href'), '/articles/');
  assert.equal(await page.getByRole('link', { name: 'خدمات طراحی سایت' }).getAttribute('href'), '/web-design/');
  const contact = page.locator('[data-contact-location="portfolio-hero"]');
  assert.match(await contact.getAttribute('href'), /^https:\/\/wa\.me\/989937825753\?text=/);
  report.links.push('Desktop navigation, service link and WhatsApp CTA');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'باز کردن منو' }).click();
  const mobileNav = page.getByRole('navigation', { name: 'منوی موبایل' });
  assert.ok(await mobileNav.isVisible());
  assert.equal(await mobileNav.getByRole('link', { name: 'نمونه‌کارها' }).getAttribute('href'), '/portfolio/');
  await page.keyboard.press('Escape');
  assert.equal(await mobileNav.isVisible(), false);
  report.links.push('Mobile navigation and Escape');

  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.violations = accessibility.violations.map(({ id, impact }) => ({ id, impact }));
  const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noScript = await noScriptContext.newPage();
  await noScript.goto(`${base}/portfolio/`);
  assert.ok(await noScript.getByRole('heading', { level: 1 }).isVisible());
  assert.match(await noScript.locator('[data-contact-location="portfolio-hero"]').getAttribute('href'), /^https:\/\/wa\.me\//);
  report.links.push('Static content and CTA without JavaScript');
  await noScriptContext.close();

  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.violations, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
