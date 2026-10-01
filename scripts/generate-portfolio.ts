import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { portfolioFixtures, type PortfolioPayload, type PublishedPortfolioItem } from '../src/portfolio-data.ts';

type Row = { id: string; kind: 'client' | 'concept'; published_payload: PortfolioPayload; sort_order: number };
const crmBuild = process.argv.includes('--crm');
const mode = crmBuild ? 'fixture' : process.env.PORTFOLIO_DATA_MODE || process.env.ARTICLE_DATA_MODE || 'fixture';
if (process.env.VERCEL_ENV === 'production' && !crmBuild && mode !== 'supabase') throw new Error('Production portfolio build requires PORTFOLIO_DATA_MODE=supabase');

function validItem(item: PublishedPortfolioItem) {
  const p = item.payload;
  if (!item.id || !['client', 'concept'].includes(item.kind) || !p || !p.title || !p.imageAlt || !p.link || !p.imagePath || !Number.isInteger(p.imageWidth) || !Number.isInteger(p.imageHeight) || p.imageWidth < 1 || p.imageHeight < 1) throw new Error('Invalid published portfolio item');
  if (!(p.link.startsWith('/') && !p.link.startsWith('//') && !p.link.includes('\\'))) {
    try { const parsed = new URL(p.link); if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error(); }
    catch { throw new Error('Invalid published portfolio link'); }
  }
  if (item.kind === 'client') {
    const siteUrl = process.env.SITE_SUPABASE_URL;
    if (!siteUrl || !p.imagePath.startsWith(`${siteUrl}/storage/v1/object/public/portfolio-covers/`)) throw new Error('Invalid published client cover URL');
  } else if (!/^\/images\/(?:nilora|veloma|zero-line|roma)\/[a-z0-9-]+\.(?:jpe?g|png|webp)$/.test(p.imagePath)) throw new Error('Invalid published concept cover');
  return item;
}

async function load(): Promise<PublishedPortfolioItem[]> {
  if (mode !== 'supabase') return portfolioFixtures;
  const url = process.env.SITE_SUPABASE_URL;
  const key = process.env.SITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('PORTFOLIO_DATA_MODE=supabase requires SITE_SUPABASE_URL and SITE_SUPABASE_PUBLISHABLE_KEY');
  const endpoint = new URL('/rest/v1/portfolio_items', url);
  endpoint.searchParams.set('select', 'id,kind,published_payload,sort_order');
  endpoint.searchParams.set('status', 'eq.published');
  endpoint.searchParams.set('archived_at', 'is.null');
  endpoint.searchParams.set('order', 'sort_order.asc,id.asc');
  const response = await fetch(endpoint, { headers: { apikey: key, authorization: `Bearer ${key}` } });
  if (!response.ok) throw new Error(`Published portfolio fetch failed (${response.status}): ${await response.text()}`);
  const rows = await response.json() as Row[];
  if (!Array.isArray(rows) || (process.env.VERCEL_ENV === 'production' && rows.length === 0)) throw new Error('Published portfolio response is empty or invalid');
  return rows.map(row => ({ id: row.id, kind: row.kind, payload: row.published_payload, sortOrder: row.sort_order }));
}

const items = (await load()).map(validItem);
const output = resolve(import.meta.dirname, '../src/portfolio.generated.ts');
await writeFile(output, `import type { PublishedPortfolioItem } from './portfolio-data';\nexport const portfolioItems: PublishedPortfolioItem[] = ${JSON.stringify(items, null, 2)};\n`, 'utf8');
console.log(`Prepared ${items.length} published portfolio item(s) from ${mode}.`);
