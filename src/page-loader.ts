import { createElement } from 'react';
import type { SitePage } from './App';

// The same loader supplies prerendered markup and the component used to hydrate it.
// No Suspense fallback replaces the HTML while a page module is loading.
export async function loadPage(page: SitePage, slug?: string) {
  switch (page) {
    case 'home': return null;
    case 'web-design': return createElement((await import('./WebDesignPage')).default);
    case 'web-design-gorgan': return createElement((await import('./WebDesignGorganPage')).default);
    case 'doctor-web-design-gorgan': return createElement((await import('./DoctorWebDesignGorganPage')).default);
    case 'corporate-web-design-gorgan': return createElement((await import('./CorporateWebDesignGorganPage')).default);
    case 'restaurant-web-design-gorgan': return createElement((await import('./RestaurantWebDesignGorganPage')).default);
    case 'web-design-price-gorgan': return createElement((await import('./WebDesignPriceGorganPage')).default);
    case 'website-support-gorgan': return createElement((await import('./WebsiteSupportGorganPage')).default);
    case 'pricing': return createElement((await import('./PricingPage')).default);
    case 'portfolio': return createElement((await import('./PortfolioPage')).default);
    case 'articles': return createElement((await import('./ArticlesPage')).ArticlesIndexPage);
    case 'article': return createElement((await import('./ArticlesPage')).ArticleDetailPage, { slug });
    case 'request': return createElement((await import('./RequestPage')).default);
    case 'free-website-audit': return createElement((await import('./FreeWebsiteAuditPage')).default);
  }
}
