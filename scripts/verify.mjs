import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const url = process.env.PIXEL_TEST_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
await mkdir('outputs', { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const report = { viewports: [], interactions: [], accessibility: null, errors: [] };
try {
  const context = await browser.newContext({ viewport: { width:1440, height:1000 }, reducedMotion:'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('heading', { level:1 }).waitFor();
  for (const width of [360,390,768,1440]) {
    await page.setViewportSize({ width, height:1000 });
    await page.evaluate(() => window.scrollTo(0,0));
    await page.screenshot({ path:`outputs/home-${width}.png`, fullPage:true });
    const layout = await page.evaluate(() => ({ width:innerWidth, scroll:document.documentElement.scrollWidth, loadedImages:[...document.images].every(image => image.complete && image.naturalWidth > 0) }));
    assert.ok(layout.scroll <= width, `Horizontal overflow at ${width}: ${layout.scroll}`);
    assert.ok(layout.loadedImages, `Missing image at ${width}`);
    report.viewports.push(layout);
  }
  for (const title of ['ایجنت سئو','ایجنت فروش','ایجنت پشتیبانی','ایجنت مارکتینگ','ایجنت اختصاصی']) {
    await page.getByRole('tab',{name:title,exact:true}).click();
    assert.equal(await page.getByRole('tabpanel').count(), 1);
    const href = await page.getByRole('tabpanel').getByRole('link').getAttribute('href');
    assert.ok(href.startsWith('https://wa.me/989937825753?text='));
    assert.ok(decodeURIComponent(href).includes(title));
  }
  report.interactions.push('All five agent tabs and context-specific WhatsApp messages');
  await page.getByRole('tab',{name:'ایجنت سئو',exact:true}).focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.getByRole('tab',{name:'ایجنت فروش',exact:true}).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home');
  assert.equal(await page.getByRole('tab',{name:'ایجنت سئو',exact:true}).getAttribute('aria-selected'), 'true');
  report.interactions.push('RTL tab arrow navigation and Home key');
  const faq = page.locator('.faq-list details').first();
  await faq.locator('summary').click();
  assert.ok(await faq.evaluate(node => node.open));
  await faq.locator('summary').click();
  assert.equal(await faq.evaluate(node => node.open), false);
  report.interactions.push('Native accessible FAQ disclosure');
  await page.evaluate(() => {
    window.__pixelEvents = [];
    window.addEventListener('pixel:contact-click', event => window.__pixelEvents.push(event.detail));
  });
  // Prevent navigation: validate analytics payload without opening WhatsApp.
  await page.locator('#hero-contact').evaluate(node => { node.addEventListener('click', event => event.preventDefault()); node.click(); });
  assert.deepEqual(await page.evaluate(() => window.__pixelEvents[0]), {location:'hero',service:'طراحی سایت',channel:'whatsapp'});
  report.interactions.push('Contact event contains location and service, with no external analytics dependency');
  const accessibility = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility = accessibility.violations.map(({id,impact,description,nodes}) => ({id,impact,description,nodes:nodes.map(({target,failureSummary})=>({target,failureSummary}))}));
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(() => window.scrollTo(0,0));
  await page.getByRole('button',{name:'باز کردن منو'}).click();
  assert.ok(await page.getByRole('navigation',{name:'منوی موبایل'}).isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('navigation',{name:'منوی موبایل'}).isVisible(),false);
  await page.getByRole('button',{name:'باز کردن منو'}).click();
  await page.getByRole('navigation',{name:'منوی موبایل'}).getByRole('link',{name:'ایجنت‌های هوش مصنوعی'}).click();
  await page.locator('.sticky-contact').waitFor({state:'visible'});
  assert.equal(await page.getByRole('navigation',{name:'منوی موبایل'}).isVisible(),false);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('.sticky-contact').waitFor({state:'detached'});
  report.interactions.push('Mobile menu, Escape, anchor navigation and sticky CTA visibility');
  await page.setViewportSize({width:1440,height:1000});
  await page.addStyleTag({content:'html { font-size:200%; }'});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Overflow at 200% text size');
  const noScriptContext = await browser.newContext({ javaScriptEnabled:false, viewport:{width:390,height:844} });
  const noScript = await noScriptContext.newPage();
  await noScript.goto(url);
  assert.ok(await noScript.getByRole('heading',{level:1}).isVisible());
  assert.ok(await noScript.locator('#hero-contact').getAttribute('href'));
  assert.ok((await noScript.locator('.noscript-agents article').count()) === 4);
  report.interactions.push('Static HTML, real CTA and agent descriptions without JavaScript');
  await writeFile('outputs/verification.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  assert.equal(report.errors.length,0,'Browser errors');
  assert.equal(report.accessibility.length,0,'Accessibility violations');
} finally { await writeFile('outputs/verification.json',JSON.stringify(report,null,2)); await browser.close(); }
