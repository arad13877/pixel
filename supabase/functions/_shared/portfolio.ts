type Json = Record<string, unknown>;
const uuidPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
export const validPortfolioId = (value: unknown) => typeof value === 'string' && uuidPattern.test(value);

function clean(value: unknown, field: string, max: number, required = true) {
  if (typeof value !== 'string') throw new Error(`invalid_${field}`);
  const result = value.trim();
  if ((required && !result) || result.length > max || /<\/?[a-z][^>]*>/i.test(result)) throw new Error(`invalid_${field}`);
  return result;
}

function link(value: unknown, kind: string) {
  const result = clean(value, 'link', 2048);
  if (result.startsWith('/') && !result.startsWith('//') && !result.includes('\\') && !/[?#]/.test(result)) {
    if (kind === 'concept' && !/^\/portfolio\/[a-z0-9-]+\/$/.test(result)) throw new Error('invalid_link');
    return result;
  }
  try {
    const parsed = new URL(result);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error();
    return parsed.toString();
  } catch { throw new Error('invalid_link'); }
}

export function validatePortfolioPayload(input: unknown, kind: 'client' | 'concept', workspaceId: string, itemId: string) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('invalid_payload');
  const data = input as Json;
  const imagePath = clean(data.imagePath, 'image_path', 2048);
  if (kind === 'client') {
    const prefix = `${workspaceId}/${itemId}/`;
    if (!imagePath.startsWith(prefix) || !/\.(?:jpe?g|png|webp)$/i.test(imagePath)) throw new Error('invalid_image_path');
  } else if (!/^\/images\/(?:nilora|veloma|zero-line|roma|gorgan-khaneh)\/[a-z0-9-]+\.(?:jpe?g|png|webp)$/.test(imagePath)) throw new Error('invalid_image_path');
  const imageWidth = Number(data.imageWidth);
  const imageHeight = Number(data.imageHeight);
  if (!Number.isInteger(imageWidth) || !Number.isInteger(imageHeight) || imageWidth < (kind === 'client' ? 1200 : 1) || imageHeight < (kind === 'client' ? 630 : 1)) throw new Error('invalid_image_dimensions');
  return {
    title: clean(data.title, 'title', 160),
    subtitle: clean(data.subtitle ?? '', 'subtitle', 180, false),
    description: clean(data.description ?? '', 'description', 500, false),
    link: link(data.link, kind),
    imagePath,
    imageAlt: clean(data.imageAlt, 'image_alt', 180),
    imageWidth,
    imageHeight,
    label: clean(data.label ?? '', 'label', 100, false),
    service: clean(data.service ?? 'طراحی سایت', 'service', 80),
    conceptNote: kind === 'concept' ? clean(data.conceptNote, 'concept_note', 160) : '',
    theme: kind === 'concept' ? (data.theme === 'sand' ? 'sand' : data.theme === 'carbon' ? 'carbon' : data.theme === 'coffee' ? 'coffee' : data.theme === 'estate' ? 'estate' : 'mint') : 'client',
  };
}

export function imageDimensions(bytes: Uint8Array, mime: string) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (mime === 'image/png' && bytes.length >= 24 && [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].every((value, index) => bytes[index] === value)) {
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }
  if (mime === 'image/jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const size = view.getUint16(offset + 2);
      if (size < 2) break;
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
        return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      }
      offset += size + 2;
    }
  }
  if (mime === 'image/webp' && bytes.length >= 30 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') {
    const type = String.fromCharCode(...bytes.slice(12, 16));
    if (type === 'VP8X') return { width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) };
    if (type === 'VP8L' && bytes[20] === 0x2f) return { width: 1 + (((bytes[22] & 0x3f) << 8) | bytes[21]), height: 1 + (((bytes[24] & 0x0f) << 10) | (bytes[23] << 2) | (bytes[22] >> 6)) };
    if (type === 'VP8 ' && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
  }
  throw new Error('invalid_image_file');
}

export function portfolioErrorStatus(code: string) {
  if (code === 'unauthorized') return 401;
  if (code === 'forbidden') return 403;
  if (code === 'portfolio_not_found') return 404;
  if (code.startsWith('invalid_') || code === 'consent_required') return 422;
  return 500;
}
