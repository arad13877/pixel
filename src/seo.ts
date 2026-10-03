export const siteOrigin = 'https://pxlgrid.design';
export const publicPages = [
  { path: '/', label: 'پیکسل' },
  { path: '/web-design/', label: 'طراحی سایت' },
  { path: '/web-design-gorgan/', label: 'طراحی سایت در گرگان' },
  { path: '/web-design-doctors-gorgan/', label: 'طراحی سایت پزشکان در گرگان' },
  { path: '/web-design-company-gorgan/', label: 'طراحی سایت شرکتی در گرگان' },
  { path: '/web-design-restaurant-gorgan/', label: 'طراحی سایت رستوران در گرگان' },
  { path: '/web-design-price-gorgan/', label: 'قیمت طراحی سایت در گرگان' },
  { path: '/website-support-gorgan/', label: 'پشتیبانی سایت در گرگان' },
  { path: '/pricing/', label: 'تعرفه‌ها' },
  { path: '/portfolio/', label: 'نمونه‌کارها' },
  { path: '/request/', label: 'ثبت درخواست پروژه' },
  { path: '/articles/', label: 'مقالات' },
  { path: '/free-website-audit/', label: 'بررسی رایگان سایت' },
  { path: '/seo/', label: 'خدمات سئو' },
  { path: '/seo-gorgan/', label: 'سئو در گرگان' },
] as const;
export const localPages = publicPages.slice(2, 8);
export const demoPaths = ['/portfolio/nilora/', '/portfolio/veloma/', '/portfolio/roma/', '/portfolio/zero-line/'];
export function isPublicArticleSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    && slug !== 'crm-upload-check-20261001'
    && !/(?:^|-)(?:test|draft|private|staging|preview|localhost)(?:-|$)/.test(slug);
}
export function breadcrumbs(path: string) {
  const page = publicPages.find(item => item.path === path);
  if (path === '/seo-gorgan/' && page) return [publicPages[0], publicPages.find(item => item.path === '/seo/')!, page];
  if (!page || !localPages.some(item => item.path === path)) return [];
  const items = [publicPages[0], publicPages[1], publicPages[2]];
  return path === publicPages[2].path ? items : [...items, page];
}
