import { assertEquals, assertThrows } from 'jsr:@std/assert@1';
import { imageDimensions, validatePortfolioPayload } from '../_shared/portfolio.ts';

const workspace = '00000000-0000-0000-0000-000000000001';
const item = '40000000-0000-0000-0000-000000000001';
const payload = { title: 'نمونه‌کار واقعی', subtitle: '', description: 'توضیح کوتاه', link: 'https://example.com/', imagePath: `${workspace}/${item}/cover.png`, imageAlt: 'تصویر صفحه نخست سایت', imageWidth: 1200, imageHeight: 630, label: '', service: 'طراحی سایت', conceptNote: '', theme: 'client' };

Deno.test('valid portfolio payload is normalized', () => {
  assertEquals(validatePortfolioPayload(payload, 'client', workspace, item).title, payload.title);
});
Deno.test('HTML, unsafe links and cross-workspace images are rejected', () => {
  assertThrows(() => validatePortfolioPayload({ ...payload, title: '<script>bad</script>' }, 'client', workspace, item));
  assertThrows(() => validatePortfolioPayload({ ...payload, link: 'javascript:alert(1)' }, 'client', workspace, item));
  assertThrows(() => validatePortfolioPayload({ ...payload, imagePath: `other/${item}/cover.png` }, 'client', workspace, item));
});
Deno.test('PNG dimension header is read before publication', () => {
  const bytes = new Uint8Array(24);
  bytes.set([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a], 0);
  new DataView(bytes.buffer).setUint32(16, 1200);
  new DataView(bytes.buffer).setUint32(20, 630);
  assertEquals(imageDimensions(bytes, 'image/png'), { width: 1200, height: 630 });
});
