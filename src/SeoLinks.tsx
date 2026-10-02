import { breadcrumbs, localPages } from './seo';

export function LocalBreadcrumb({ path }: { path: string }) {
  const items = breadcrumbs(path);
  return <nav className="seo-breadcrumb container" aria-label="مسیر صفحه"><ol>{items.map((item, index) => <li key={item.path}>{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <a href={item.path}>{item.label}</a>}</li>)}</ol></nav>;
}

export function LocalServiceLinks() {
  return <nav className="seo-related-links" aria-label="خدمات مرتبط در گرگان">{localPages.slice(1).map(item => <a key={item.path} href={item.path}>{item.label}</a>)}</nav>;
}
