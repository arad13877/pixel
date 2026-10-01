import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [];
try {
  await mkdir('outputs', { recursive: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${base}/pricing/`);
  assert.equal(response.status(), 200);
  assert.equal(await page.title(), 'تعرفه طراحی سایت و قیمت پلن‌ها | پیکسل');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('main h1').count(), 1);
  assert.equal(await page.locator('.pricing-card').count(), 6);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://pxlgrid.design/pricing/');
  const expected = [
    ['لندینگ تبلیغاتی', '۱۰ میلیون تومان'],
    ['سایت شرکتی', '۲۰ میلیون تومان'],
    ['سایت خدماتی', '۳۰ میلیون تومان'],
    ['وب‌سایت محصول و SaaS', '۲۵ میلیون تومان'],
    ['فروشگاه پایه', '۳۰ میلیون تومان'],
    ['پروژهٔ اختصاصی', 'پس از بررسی'],
  ];
  for (const [index, [title, price]] of expected.entries()) {
    const card = page.locator('.pricing-card').nth(index);
    assert.equal(await card.locator('h3').innerText(), title);
    assert.equal(await card.locator('.pricing-card-price strong').innerText(), price);
    const link = card.locator('a[data-contact-service]');
    assert.match(decodeURIComponent(await link.getAttribute('href')), new RegExp(`پلن ${title}`));
    assert.equal(await link.getAttribute('data-contact-location'), `pricing-page-${['landing','corporate','services','product','store','custom'][index]}`);
  }
  assert.equal(await page.getByRole('navigation', { name: 'ناوبری اصلی' }).getByRole('link', { name: 'تعرفه‌ها' }).getAttribute('aria-current'), 'page');
  await page.locator('.pricing-faq-list summary').first().click();
  assert.equal(await page.locator('.pricing-faq-list details').first().getAttribute('open'), '');
  const violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations;
  assert.deepEqual(violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), []);
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(scrollWidth <= width, `Pricing horizontal overflow at ${width}: ${scrollWidth}`);
    if (width === 390 || width === 1440) await page.screenshot({ path: `outputs/pricing-${width}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'باز کردن منو' }).click();
  const mobileMenu = page.getByRole('navigation', { name: 'منوی موبایل' });
  assert.ok(await mobileMenu.isVisible());
  assert.equal(await mobileMenu.getByRole('link', { name: 'تعرفه‌ها' }).getAttribute('href'), '/pricing/');
  await page.keyboard.press('Escape');
  assert.equal(await mobileMenu.isVisible(), false);

  for (const route of ['/web-design/', '/web-design-gorgan/']) {
    await page.goto(`${base}${route}`);
    const cards = page.locator('.pricing-preview .pricing-card');
    assert.equal(await cards.count(), 3);
    for (let index = 0; index < 3; index++) {
      assert.equal(await cards.nth(index).locator('h3').innerText(), expected[index][0]);
      assert.equal(await cards.nth(index).locator('.pricing-card-price strong').innerText(), expected[index][1]);
    }
    assert.equal(await page.locator('.pricing-preview .pricing-all-link').getAttribute('href'), '/pricing/');
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(scrollWidth <= width, `${route} horizontal overflow at ${width}: ${scrollWidth}`);
    }
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/pricing/`);
  assert.equal(await staticPage.locator('main h1').count(), 1);
  assert.equal(await staticPage.locator('.pricing-card').count(), 6);
  await noJs.close();
  const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text();
  assert.ok(sitemap.includes('https://pxlgrid.design/pricing/'));
  assert.deepEqual(errors, []);
  console.log('Pricing page, shared cards, contact links, responsive layout, accessibility and static HTML verified.');
} finally {
  await browser.close();
}
