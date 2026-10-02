import { breadcrumbs, publicPages, siteOrigin } from '../src/seo.ts';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const decode = (value: string) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const safeJson = (value: unknown) => JSON.stringify(value).replaceAll('<', '\\u003c');
const architecture = { path: '/images/interior.webp', alt: 'تصویر معماری کانسپت نمایشی طراحی سایت پیکسل' };
const images: Record<string, { path: string; alt: string }> = {
  '/': architecture, '/web-design/': architecture, '/web-design-gorgan/': architecture,
  '/web-design-company-gorgan/': architecture, '/web-design-price-gorgan/': architecture, '/pricing/': architecture,
  '/web-design-doctors-gorgan/': { path: '/images/nilora/reception.jpg', alt: 'کانسپت نمایشی نیلورا؛ کلینیک واقعی نیست' },
  '/web-design-restaurant-gorgan/': { path: '/images/roma/interior.jpg', alt: 'کانسپت نمایشی روما؛ کافه واقعی نیست' },
  '/portfolio/': { path: '/images/nilora/reception.jpg', alt: 'کانسپت نمایشی نیلورا در نمونه‌کارهای پیکسل' },
};
export function staticSeoMetadata(html: string, path: string) {
  const page = publicPages.find(page => page.path === path);
  if (!page) return html;
  const title = decode(html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || '');
  const description = decode(html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] || '');
  const values: Record<string, string> = { 'og:type': 'website', 'og:locale': 'fa_IR', 'og:site_name': 'پیکسل', 'og:title': title, 'og:description': description, 'og:url': siteOrigin + path };
  const image = images[path];
  if (image) {
    if (!existsSync(resolve(import.meta.dirname, '../public', '.' + image.path))) throw new Error(`SEO: missing OG image ${image.path}`);
    values['og:image'] = siteOrigin + image.path;
    values['og:image:alt'] = image.alt;
  }
  let additions = Object.entries(values).filter(([property]) => !html.includes(`property="${property}"`)).map(([property, value]) => `<meta property="${property}" content="${escape(value)}"/>`).join('');
  const organization = { '@type': 'Organization', '@id': siteOrigin + '/#organization', name: 'پیکسل', url: siteOrigin + '/' };
  const graph: object[] = [];
  if (path === '/') graph.push(organization, { '@type': 'WebSite', '@id': siteOrigin + '/#website', name: 'پیکسل', url: siteOrigin + '/', inLanguage: 'fa-IR', publisher: { '@id': organization['@id'] } });
  if (publicPages.slice(1, 8).some(page => page.path === path)) graph.push({ '@type': 'Service', '@id': siteOrigin + path + '#service', name: page.label, description, url: siteOrigin + path, serviceType: path === '/website-support-gorgan/' ? 'پشتیبانی سایت' : 'طراحی سایت', provider: { '@type': 'Organization', '@id': organization['@id'], name: organization.name, url: organization.url }, ...(path !== '/web-design/' ? { areaServed: { '@type': 'City', name: 'گرگان' } } : {}) });
  const trail = breadcrumbs(path);
  if (trail.length) graph.push({ '@type': 'BreadcrumbList', itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: siteOrigin + item.path })) });
  if (graph.length) additions += `<script type="application/ld+json">${safeJson({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
  return html.replace('</head>', additions + '</head>');
}
