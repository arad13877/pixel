import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { imageDimensions, validatePortfolioPayload } from '../supabase/functions/_shared/portfolio.ts';

const workspace = '00000000-0000-0000-0000-000000000001';
const item = '40000000-0000-0000-0000-000000000001';
const payload = { title: 'نمونه‌کار واقعی', subtitle: '', description: 'توضیح کوتاه', link: 'https://example.com/', imagePath: `${workspace}/${item}/cover.jpg`, imageAlt: 'تصویر صفحه نخست سایت', imageWidth: 1200, imageHeight: 630, label: '', service: 'طراحی سایت', conceptNote: '', theme: 'client' };

test('portfolio payload requires safe link and private workspace image', () => {
  assert.equal(validatePortfolioPayload(payload, 'client', workspace, item).title, payload.title);
  assert.throws(() => validatePortfolioPayload({ ...payload, link: 'javascript:alert(1)' }, 'client', workspace, item));
  assert.throws(() => validatePortfolioPayload({ ...payload, link: '//malicious.example' }, 'client', workspace, item));
  assert.throws(() => validatePortfolioPayload({ ...payload, imagePath: `other/${item}/cover.jpg` }, 'client', workspace, item));
  assert.throws(() => validatePortfolioPayload({ ...payload, title: '<img src=x>' }, 'client', workspace, item));
  assert.throws(() => validatePortfolioPayload({ ...payload, imageAlt: '' }, 'client', workspace, item));
});

test('server reads dimensions from an actual JPEG and rejects fake image bytes', async () => {
  const bytes = new Uint8Array(await readFile('public/images/nilora/reception.jpg'));
  assert.deepEqual(imageDimensions(bytes, 'image/jpeg'), { width: 1536, height: 1024 });
  assert.throws(() => imageDimensions(new Uint8Array([1, 2, 3]), 'image/jpeg'));
});

test('PNG dimensions are parsed before publication', () => {
  const bytes = new Uint8Array(24);
  bytes.set([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a], 0);
  new DataView(bytes.buffer).setUint32(16, 1200);
  new DataView(bytes.buffer).setUint32(20, 630);
  assert.deepEqual(imageDimensions(bytes, 'image/png'), { width: 1200, height: 630 });
});
