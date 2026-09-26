import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { validatePortfolioPayload } from '../supabase/functions/_shared/portfolio.ts';
import { portfolioFixtures } from '../src/portfolio-data.ts';

const fixture = portfolioFixtures.find(item => item.payload.link === '/portfolio/zero-line/');
assert.ok(fixture);
assert.equal(fixture.kind, 'concept');
assert.equal(validatePortfolioPayload(fixture.payload, 'concept', '00000000-0000-0000-0000-000000000001', fixture.id).theme, 'carbon');
assert.throws(() => validatePortfolioPayload({ ...fixture.payload, imagePath: '/images/other/hero.jpg' }, 'concept', '00000000-0000-0000-0000-000000000001', fixture.id), /invalid_image_path/);

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true });
const report = { viewports: [], errors: [], violations: [], requestsAfterSubmit: [] };

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
  await page.goto(`${base}/portfolio/zero-line/`);
  await page.evaluate(() => document.fonts.ready);
  assert.match(await page.title(), /لاین صفر \| کانسپت نمایشی پیکسل/);
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
  assert.ok(await page.getByText('کانسپت نمایشی پیکسل؛ کسب‌وکار واقعی نیست').first().isVisible());
  assert.ok(await page.getByRole('heading', { level: 1, name: /جزئیات/ }).isVisible());
  assert.equal(await page.getByRole('link', { name: /بازگشت به نمونه‌کارها/ }).first().getAttribute('href'), '/portfolio/');

  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const state = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.ok(state.scrollWidth <= width, `Horizontal overflow at ${width}: ${state.scrollWidth}`);
    report.viewports.push(state);
  }
  for (const image of await page.locator('.zero-page img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => element.decode());
    assert.ok(await image.evaluate(element => element.naturalWidth > 0));
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('link', { name: 'شروع درخواست نمایشی' }).click();
  assert.equal(new URL(page.url()).hash, '#inquiry');
  const submit = page.getByRole('button', { name: 'نمایش ثبت درخواست' });
  await submit.click();
  assert.equal(await page.locator('#zl-name').evaluate(element => element.validity.valueMissing), true);
  await page.locator('#zl-name').fill('بازدیدکنندهٔ نمایشی');
  await page.locator('#zl-mobile').fill('09123456789');
  await page.locator('#zl-service').selectOption('01');
  page.on('request', request => report.requestsAfterSubmit.push(request.url()));
  await submit.click();
  assert.ok(await page.getByRole('status').getByText('این نسخه نمایشی است؛ درخواستی ثبت نشد.').isVisible());
  assert.deepEqual(report.requestsAfterSubmit, []);

  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.violations = accessibility.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }));
  const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noScript = await noScriptContext.newPage();
  await noScript.goto(`${base}/portfolio/zero-line/`);
  assert.ok(await noScript.getByRole('heading', { level: 1 }).isVisible());
  assert.ok(await noScript.getByText('کانسپت نمایشی پیکسل؛ کسب‌وکار واقعی نیست').first().isVisible());
  assert.ok(await noScript.getByRole('heading', { level: 2, name: /هر سطح/ }).isVisible());
  await noScriptContext.close();

  console.log(JSON.stringify(report, null, 2));
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.violations, []);
} finally {
  await browser.close();
}
