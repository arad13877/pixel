import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report = { viewports: [], links: [], violations: [], errors: [] };
try {
  await mkdir('outputs', { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
  const response = await page.goto(`${base}/web-design/`);
  assert.equal(response.status(), 200);
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.title(), 'طراحی سایت حرفه‌ای برای کسب‌وکارها | پیکسل');
  const exactCopy = [
    'طراحی سایت از ایده تا انتشار',
    'طراحی سایت حرفه‌ای برای کسب‌وکاری که می‌خواهد جدی‌تر دیده شود.',
    'مشاوره رایگان طراحی سایت',
    'سایت فقط ویترین نیست؛ شروع اعتماد مشتری است.',
    'چه نوع وب‌سایتی برای کسب‌وکارت مناسب است؟',
    'وب‌سایت شرکتی', 'وب‌سایت خدماتی', 'لندینگ تبلیغاتی', 'وب‌سایت محصول و SaaS',
    'در پایان چه تحویل می‌گیری؟', 'طراحی اختصاصی UI/UX', 'نسخه کامل همه دستگاه‌ها',
    'توسعه سریع و قابل گسترش', 'ساختار فنی مناسب SEO', 'مسیرهای واضح تماس',
    'کمک به ساختاربندی محتوا', 'نسخه آماده انتشار',
    'تصمیم‌های دقیق، پیش از جزئیات زیبا.',
    'از «سایت ندارم» تا «این سایت کسب‌وکار من است».',
    'شناخت', 'ساختار و محتوا', 'طراحی', 'توسعه و تست', 'انتشار',
    'هزینه طراحی سایت چطور مشخص می‌شود؟',
    'آیا سایت برای SEO آماده است؟',
    'برای شروع سایت کسب‌وکارت آماده‌ای؟',
    'شروع مشاوره رایگان',
  ];
  const copy = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  for (const text of exactCopy) assert.ok(copy.includes(text), `Missing exact copy: ${text}`);
  assert.equal(await page.locator('main h1').count(), 1);
  assert.equal(await page.locator('.wd-type').count(), 4);
  assert.equal(await page.locator('.wd-deliverable').count(), 7);
  assert.equal(await page.locator('.wd-reason').count(), 4);
  assert.equal(await page.locator('.wd-step').count(), 5);
  assert.equal(await page.locator('.wd-faq-list details').count(), 6);
  assert.equal(await page.locator('.wd-project-placeholder').count(), 0);
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src) }));
    assert.ok(state.scrollWidth <= width, `Horizontal overflow at ${width}: ${state.scrollWidth}`);
    assert.equal(state.brokenImages.length, 0, `Broken image at ${width}`);
    report.viewports.push(state);
    if (width === 390 || width === 768 || width === 1440) await page.screenshot({ path: `outputs/web-design-${width}.png`, fullPage: true });
  }
  const heroCTA = page.locator('#hero-contact');
  assert.match(await heroCTA.getAttribute('href'), /^https:\/\/wa\.me\/989937825753\?text=/);
  assert.equal(await heroCTA.getAttribute('data-contact-location'), 'web-design-hero');
  assert.equal(await page.getByRole('link', { name: /ببین چه تحویل می‌گیری/ }).getAttribute('href'), '#deliverables');
  const deliverableCTA = page.locator('[data-contact-location="web-design-deliverables"]');
  const finalCTA = page.locator('[data-contact-location="web-design-final"]');
  assert.match(await deliverableCTA.getAttribute('href'), /^https:\/\/wa\.me\/989937825753\?text=/);
  assert.match(await finalCTA.getAttribute('href'), /^https:\/\/wa\.me\/989937825753\?text=/);
  assert.match(decodeURIComponent(await heroCTA.getAttribute('href')), /مشاوره اولیه رایگان/);
  report.links.push('Hero, deliverables and final WhatsApp CTAs resolve with distinct locations');
  const desktopLinks = page.getByRole('navigation', { name: 'ناوبری اصلی' });
  assert.equal(await desktopLinks.getByRole('link', { name: /پیکسل PIXEL STUDIO/ }).getAttribute('href'), '/');
  assert.equal(await desktopLinks.getByRole('link', { name: 'طراحی سایت' }).getAttribute('href'), '#types');
  assert.equal(await desktopLinks.getByRole('link', { name: 'نمونه‌کارها' }).getAttribute('href'), '/portfolio/');
  assert.equal(await desktopLinks.getByRole('link', { name: /ایجنت‌های هوش مصنوعی/ }).getAttribute('href'), '/#agents');
  assert.equal(await desktopLinks.getByRole('link', { name: 'مقالات' }).getAttribute('href'), '/articles/');
  report.links.push('Navigation points to sections and the existing agent page');
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.violations = axe.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'باز کردن منو' }).click();
  const mobile = page.getByRole('navigation', { name: 'منوی موبایل' });
  assert.ok(await mobile.isVisible());
  await mobile.getByRole('link', { name: 'طراحی سایت' }).click();
  assert.equal(await mobile.isVisible(), false);
  assert.equal(new URL(page.url()).hash, '#types');
  await page.getByRole('button', { name: 'باز کردن منو' }).click();
  await page.keyboard.press('Escape');
  assert.equal(await mobile.isVisible(), false);
  report.links.push('Mobile navigation and Escape close work');
  const firstFaq = page.locator('.wd-faq-list details').first();
  await firstFaq.locator('summary').click();
  assert.equal(await firstFaq.getAttribute('open'), '');
  report.links.push('FAQ disclosure works');
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/web-design/`);
  assert.ok(await staticPage.getByRole('heading', { level: 1 }).isVisible());
  assert.equal(await staticPage.locator('.wd-step').count(), 5);
  assert.ok(await staticPage.locator('#hero-contact').getAttribute('href'));
  assert.equal(await staticPage.locator('.wd-faq-list details').count(), 6);
  report.links.push('Page copy and contact link render without JavaScript');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/`);
  assert.match(await page.getByRole('heading', { level: 1 }).innerText(), /کسب‌وکارت/);
  assert.equal(await page.getByRole('tab').count(), 5);
  assert.equal(await page.getByRole('navigation', { name: 'ناوبری اصلی' }).getByRole('link', { name: 'طراحی سایت' }).getAttribute('href'), '/web-design/');
  report.links.push('Existing homepage still renders');
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.violations, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile('outputs/web-design-verification.json', JSON.stringify(report, null, 2));
  await browser.close();
}
