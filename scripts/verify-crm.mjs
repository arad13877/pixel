import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const url = process.env.PIXEL_CRM_URL || 'http://127.0.0.1:4174/?preview=empty';
const executablePath = process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
await mkdir('outputs', { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const report = { viewports: [], routes: [], errors: [], accessibility: [] };
try {
  for (const width of [360, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'داشبورد فروش' }).waitFor();
    const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, dir: document.documentElement.dir }));
    assert.ok(layout.scrollWidth <= width, `CRM overflow at ${width}`);
    assert.equal(layout.dir, 'rtl');
    await page.screenshot({ path: `outputs/crm-${width}.png`, fullPage: true });
    report.viewports.push(layout);
    if (width === 390) {
      await page.getByRole('button', { name: 'باز کردن منو' }).click();
      assert.ok(await page.getByRole('complementary', { name: 'ناوبری پنل' }).isVisible());
      await page.keyboard.press('Escape');
    }
    await page.goto(new URL('/portfolio/new?preview=empty', url).toString(), { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'نمونه‌کار جدید', level: 1 }).waitFor();
    const portfolioLayout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.ok(portfolioLayout.scrollWidth <= width, `Portfolio editor overflow at ${width}`);
    await page.screenshot({ path: `outputs/portfolio-editor-${width}.png`, fullPage: true });
    await page.goto(new URL('/portfolio?preview=empty', url).toString(), { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'مدیریت نمونه‌کارها', level: 1 }).waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Portfolio list overflow at ${width}`);
    if (width === 1440) {
      await page.goto(url, { waitUntil: 'networkidle' });
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      report.accessibility = axe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(node => node.target) }));
      for (const [name, heading] of [['ورودی‌ها','سرنخ‌های جدید'],['فروش','پایپ‌لاین فرصت‌ها'],['مخاطبان','مخاطبان'],['پیگیری‌ها','پیگیری‌ها'],['مقالات','مدیریت مقالات'],['نمونه‌کارها','مدیریت نمونه‌کارها']]) {
        await page.getByRole('link', { name, exact: true }).first().click();
        await page.getByRole('heading', { name: heading, level: 1 }).waitFor();
        report.routes.push(name);
      }
      await page.getByRole('link', { name: 'مقالات', exact: true }).first().click();
      await page.getByRole('link', { name: 'مقاله جدید' }).click();
      await page.getByRole('heading', { name: 'پیش‌نویس بدون عنوان', level: 1 }).waitFor();
      assert.ok(await page.getByRole('heading', { name: 'بدنه مقاله' }).isVisible());
      const previewButton = page.getByRole('button', { name: 'پیش‌نمایش' });
      await previewButton.click();
      const previewDialog = page.getByRole('dialog', { name: 'پیش‌نمایش مقاله' });
      await previewDialog.waitFor();
      assert.ok(await page.getByRole('button', { name: 'بستن پیش‌نمایش' }).evaluate(element => element === document.activeElement));
      await page.keyboard.press('Escape');
      assert.ok(await previewButton.evaluate(element => element === document.activeElement));
      const editorAxe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      report.accessibility.push(...editorAxe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(node => node.target) })));
      report.routes.push('ویرایشگر مقاله');
      await page.getByRole('link', { name: 'نمونه‌کارها', exact: true }).first().click();
      await page.getByRole('link', { name: 'نمونه‌کار جدید' }).click();
      await page.getByRole('heading', { name: 'نمونه‌کار جدید', level: 1 }).waitFor();
      const portfolioPreviewButton = page.getByRole('button', { name: 'پیش‌نمایش' });
      await portfolioPreviewButton.click();
      const portfolioDialog = page.getByRole('dialog', { name: 'پیش‌نمایش نمونه‌کار' });
      await portfolioDialog.waitFor();
      assert.ok(await page.getByRole('button', { name: 'بستن پیش‌نمایش' }).evaluate(element => element === document.activeElement));
      await page.keyboard.press('Escape');
      assert.ok(await portfolioPreviewButton.evaluate(element => element === document.activeElement));
      const portfolioAxe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      report.accessibility.push(...portfolioAxe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(node => node.target) })));
      report.routes.push('ویرایشگر نمونه‌کار');
    }
    await context.close();
  }
  const loginContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const loginPage = await loginContext.newPage();
  loginPage.on('pageerror', error => report.errors.push(error.message));
  loginPage.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
  const loginUrl = new URL('/login', url).toString();
  await loginPage.goto(loginUrl, { waitUntil: 'networkidle' });
  await loginPage.getByRole('heading', { name: 'ورود به CRM پیکسل' }).waitFor();
  const loginAxe = await new AxeBuilder({ page: loginPage }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility.push(...loginAxe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(node => node.target) })));
  report.routes.push('ورود محافظت‌شده');
  await loginContext.close();
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.accessibility, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile('outputs/crm-verification.json', JSON.stringify(report, null, 2));
  await browser.close();
}
