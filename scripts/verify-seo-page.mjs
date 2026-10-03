import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.PIXEL_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [];
await mkdir('outputs', { recursive: true });
try {
  for (const width of [360, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await page.goto(`${base}/seo/`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    assert.match(await page.locator('h1').innerText(), /خدمات سئو سایت/);
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    assert.equal(await page.locator('.pricing-card').count(), 3);
    assert.equal(await page.locator('.pricing-card-price strong').allTextContents().then(values => values.every(value => value === 'پس از بررسی سایت')), true);
    assert.equal(await page.locator('.pricing-card-featured').count(), 0);
    await page.getByRole('link', { name: 'مشاهده تعرفه‌ها', exact: true }).click();
    assert.equal(new URL(page.url()).hash, '#seo-plans');
    const firstQuestion = page.locator('.wd-faq-list details').first();
    await firstQuestion.locator('summary').click();
    assert.equal(await firstQuestion.getAttribute('open'), '');
    if (width === 360) {
      await page.getByRole('button', { name: 'باز کردن منو' }).click();
      assert.equal(await page.locator('#mobile-menu').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#mobile-menu').isVisible(), false);
    }
    if (width === 1440) {
      const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.deepEqual(accessibility.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
      const contacts = await page.locator('[data-contact-location^="seo-"]').evaluateAll(links => links.map(link => ({ href: link.href, location: link.dataset.contactLocation, service: link.dataset.contactService })));
      assert.equal(contacts.length, 5);
      for (const contact of contacts) {
        const url = new URL(contact.href);
        assert.equal(url.hostname, 'wa.me');
        assert.equal(url.pathname, '/989937825753');
        assert.ok(url.searchParams.get('text').includes(contact.service));
      }
      await page.evaluate(() => {
        window.auditContactEvent = null;
        window.addEventListener('pixel:contact-click', event => { window.auditContactEvent = event.detail; }, { once: true });
        document.querySelector('[data-contact-location="seo-plan-service-pages"]').addEventListener('click', event => event.preventDefault());
      });
      await page.locator('[data-contact-location="seo-plan-service-pages"]').click();
      assert.equal(await page.evaluate(() => window.auditContactEvent.location), 'seo-plan-service-pages');
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      const service = schemas.flatMap(text => JSON.parse(text)['@graph'] || [JSON.parse(text)]).find(item => item['@type'] === 'Service');
      assert.equal(service.url, 'https://pxlgrid.design/seo/');
      assert.equal(service.areaServed, undefined);
      assert.equal(service.aggregateRating, undefined);
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://pxlgrid.design/seo/');
    }
    await page.screenshot({ path: `outputs/seo-${width}.png`, fullPage: true });
    await context.close();
    console.log(`PASS SEO page at ${width}px`);
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${base}/seo/`);
  assert.equal(await page.locator('.pricing-card').count(), 3);
  assert.equal(await page.locator('.wd-faq-list details').count(), 9);
  assert.equal(await page.locator('h1').isVisible(), true);
  const main = page.locator('main');
  for (const path of ['/web-design/', '/web-design-gorgan/', '/pricing/', '/free-website-audit/', '/request/']) assert.ok(await main.locator(`a[href="${path}"]`).count());
  assert.equal(await main.locator('a[href^="/articles/"]').count(), 2);
  const artifact = await readFile('dist/seo/index.html', 'utf8');
  assert.ok(!artifact.includes('<!--app-html-->'));
  assert.ok((await readFile('dist/sitemap.xml', 'utf8')).includes('https://pxlgrid.design/seo/'));
  for (const path of ['/pricing/', '/web-design-gorgan/']) {
    await page.goto(base + path);
    assert.ok(await page.locator('main a[href="/seo/"]').count(), `missing inbound link from ${path}`);
  }
  await context.close();
  assert.deepEqual(errors, []);
  console.log('PASS SEO: static HTML, schema, metadata, internal links, WhatsApp events and accessibility.');
} finally { await browser.close(); }
