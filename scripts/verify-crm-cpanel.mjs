import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright-core';

const dist = resolve(import.meta.dirname, '../crm/dist');
const productionOrigin = 'https://xyhrscvywupxfinwxdup.supabase.co';
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.woff': 'font/woff', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.txt': 'text/plain',
};
const headers = await readFile(resolve(dist, '.htaccess'), 'utf8');
assert.match(headers, /RewriteBase \//);
assert.match(headers, /RewriteCond %\{REQUEST_FILENAME\} !-f/);
assert.match(headers, /RewriteCond %\{REQUEST_FILENAME\} !-d/);
assert.match(headers, /RewriteRule \^ index\.html \[L\]/);
const csp = headers.match(/Header always set Content-Security-Policy "([^"]+)"/)?.[1];
assert.ok(csp, 'packaged CSP must be tested, not bypassed');

// Mirror the SPA fallback locally to exercise the actual packaged HTML/assets.
// The supplied .htaccess implements this fallback on the cPanel Apache host.
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    let file = resolve(dist, `.${decodeURIComponent(pathname)}`);
    if (file !== dist && !file.startsWith(`${dist}${sep}`)) {
      response.writeHead(403).end(); return;
    }
    try { if (!(await stat(file)).isFile()) throw new Error('not_file'); }
    catch {
      if (pathname.startsWith('/assets/')) { response.writeHead(404).end(); return; }
      file = resolve(dist, 'index.html');
    }
    const content = await readFile(file);
    response.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream', 'content-security-policy': csp });
    response.end(content);
  } catch { response.writeHead(500).end(); }
});
await new Promise(resolveReady => server.listen(0, '127.0.0.1', resolveReady));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.PIXEL_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const pageErrors = [];
  const requests = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  // Verify the client targets Production, without sending a login attempt or
  // creating rate-limit records in the live database.
  await page.route('https://*.supabase.co/**', async route => {
    const url = route.request().url();
    assert.equal(new URL(url).origin, productionOrigin);
    requests.push(url);
    await route.fulfill({
      status: 401, contentType: 'application/json',
      headers: { 'access-control-allow-origin': base },
      body: JSON.stringify({ message: 'Invalid credentials' }),
    });
  });
  for (const path of ['/login', '/articles', '/pipeline', '/reset-password', '/auth/reset-password', '/portfolio']) {
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, path);
    const recovery = path.endsWith('reset-password');
    await page.getByRole('heading', { name: recovery ? 'تنظیم رمز تازه' : 'ورود به CRM پیکسل' }).waitFor();
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: recovery ? 'تنظیم رمز تازه' : 'ورود به CRM پیکسل' }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.dir), 'rtl');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path);
  }
  await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
  await page.getByLabel('نام کاربری', { exact: true }).fill('package_verification');
  await page.getByLabel('رمز عبور', { exact: true }).fill('intercepted-local-check');
  await page.getByRole('button', { name: 'ورود به پنل', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.ok(requests.some(url => url === `${productionOrigin}/functions/v1/sign-in-username`));
  assert.deepEqual(pageErrors, []);
  // Recovery opened in a new tab must not be revoked by the requesting tab.
  // All API traffic is intercepted; no recovery email or production user is used.
  const recoveryContext = await browser.newContext();
  let logoutCalls = 0;
  const user = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', email: 'recovery@example.test', app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString(), last_sign_in_at: new Date().toISOString() };
  const payload = { sub: user.id, role: 'authenticated', aud: 'authenticated', session_id: '22222222-2222-4222-8222-222222222222', exp: Math.floor(Date.now() / 1000) + 3600 };
  const accessToken = `test.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.test`;
  await recoveryContext.route('https://*.supabase.co/**', async route => {
    const path = new URL(route.request().url()).pathname;
    let body;
    if (path.endsWith('/token')) body = { access_token: accessToken, refresh_token: 'test-refresh', token_type: 'bearer', expires_in: 3600, user };
    else if (path.endsWith('/workspace_members')) body = { workspace_id: '00000000-0000-0000-0000-000000000001', user_id: user.id, role: 'admin', is_active: true, profile: { username: 'arad', full_name: 'Local test', email: user.email } };
    else if (path.endsWith('/logout')) { logoutCalls++; body = {}; }
    else body = user;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  const requestingTab = await recoveryContext.newPage();
  await requestingTab.goto(`${base}/auth/forgot-password`, { waitUntil: 'networkidle' });
  await requestingTab.evaluate(() => localStorage.setItem('sb-xyhrscvywupxfinwxdup-auth-token-code-verifier', JSON.stringify('local-test-verifier/recovery')));
  const resetTab = await recoveryContext.newPage();
  await resetTab.goto(`${base}/auth/reset-password?code=local-test-code`, { waitUntil: 'networkidle' });
  await resetTab.getByLabel('رمز تازه', { exact: true }).waitFor();
  await requestingTab.bringToFront();
  await requestingTab.waitForTimeout(500);
  assert.equal(logoutCalls, 0, 'requesting tab must not sign out the recovery session');
  await resetTab.getByLabel('رمز تازه', { exact: true }).waitFor();
  await resetTab.reload({ waitUntil: 'networkidle' });
  await resetTab.getByLabel('رمز تازه', { exact: true }).waitFor();
  // Exercise the actual cover handler under the packaged cPanel CSP. Network
  // is mocked: this creates no account, object, or article in Production.
  await resetTab.evaluate(() => localStorage.setItem('pixel-crm-login-start:22222222-2222-4222-8222-222222222222', String(Date.now())));
  let coverUploads = 0;
  const pngData = await resetTab.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 630;
    return canvas.toDataURL('image/png').split(',')[1];
  });
  const png = Buffer.from(pngData, 'base64');
  await recoveryContext.route('**/storage/v1/**', async route => {
    if (route.request().method() === 'POST') {
      coverUploads++;
      assert.match(new URL(route.request().url()).pathname, /\/article-covers\/00000000-0000-0000-0000-000000000001\//);
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ Key: 'local-cover-test' }) });
    } else await route.fulfill({ status: 200, contentType: 'image/png', body: png });
  });
  await resetTab.goto(`${base}/articles/new`, { waitUntil: 'networkidle' });
  await resetTab.locator('input[type="file"]').setInputFiles({ name: 'local-cover.png', mimeType: 'image/png', buffer: png });
  await resetTab.getByAltText('پیش‌نمایش کاور', { exact: true }).waitFor();
  assert.equal(coverUploads, 1, 'cover must reach Storage after local dimension validation');
  assert.equal(await resetTab.getByRole('alert').count(), 0);
  await recoveryContext.close();
  console.log('PASS: packaged CSP and cover upload, two-tab password recovery, routes/refresh, RTL/mobile, and Production endpoint. All API calls mocked.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolveClosed => server.close(resolveClosed));
}
