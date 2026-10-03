import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

// Run against a separate build with Cloudflare's public test sitekey. Requests
// are intercepted; no test lead or captcha token reaches production.
const base = process.env.PIXEL_LEAD_FIXTURE_URL;
if (!base || new URL(base).hostname !== '127.0.0.1') throw new Error('Set PIXEL_LEAD_FIXTURE_URL to the isolated localhost fixture.');
const browser = await chromium.launch({ executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  for (const path of ['/request/', '/free-website-audit/']) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let calls = 0, succeed = false, payload;
    await page.route('https://challenges.cloudflare.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
    await page.route('**/functions/v1/submit-lead', async route => {
      calls++; payload = route.request().postDataJSON();
      await route.fulfill({ status: succeed ? 201 : 500, contentType: 'application/json', body: succeed ? '{"ok":true}' : '{"message":"خطای آزمایشی سرور"}' });
    });
    await page.goto(base + path);
    const form = page.locator('form.request-form');
    const button = form.getByRole('button', { name: path === '/request/' ? 'ثبت درخواست' : 'درخواست بررسی رایگان سایت', exact: true });
    await button.waitFor({ state: 'visible' });
    await form.locator('[name="name"]').fill('کاربر آزمایشی');
    await form.locator('[name="phone"]').fill('09121234567');
    await form.locator('[name="business_name"]').fill('تست محلی');
    if (path === '/request/') {
      await form.locator('[name="service_type"]').selectOption('web_design');
      await form.locator('[name="brief"]').fill('درخواست آزمایشی محلی برای بررسی رفتار فرم');
    } else {
      await form.locator('[name="phone"]').fill('۰۹۱۲۱۲۳۴۵۶۷');
      await form.locator('[name="site_url"]').fill('example.com');
      await form.locator('[name="activity"]').fill('فعالیت آزمایشی');
    }
    await form.locator('[name="consent"]').check();
    await button.click();
    await form.locator('.form-status').filter({ hasText: 'اعتبارسنجی امنیتی' }).waitFor();
    assert.equal(calls, 0, 'Missing token must not send a request');
    // Fixture-only token: the server request is intercepted above.
    await form.evaluate(element => {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = 'cf-turnstile-response'; input.value = 'local-fixture-token'; element.append(input);
    });
    await button.click();
    await form.locator('.form-status').filter({ hasText: 'خطای آزمایشی سرور' }).waitFor();
    assert.equal(calls, 1);
    assert.equal(await form.locator('[name="name"]').inputValue(), 'کاربر آزمایشی');
    assert.equal(payload['cf-turnstile-response'], 'local-fixture-token');
    if (path === '/free-website-audit/') {
      assert.equal(payload.phone, '09121234567');
      assert.match(payload.brief, /https:\/\/example.com/);
    }
    succeed = true;
    await button.click();
    await form.locator('.form-status').filter({ hasText: 'ثبت شد' }).waitFor();
    assert.equal(calls, 2);
    assert.equal(await form.locator('[name="name"]').inputValue(), '');
    assert.deepEqual(errors, [], 'No hydration/runtime errors with configured sitekey');
    console.log(`PASS ${path}: token required, error retains values, retry succeeds and resets form`);
    await page.close();
  }
} finally { await browser.close(); }
