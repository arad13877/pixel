import ContactPage from './ContactPage';
import SeoGorganPage from './SeoGorganPage';
import SeoPage from './SeoPage';
import WebDesignPage from './WebDesignPage';
import WebDesignGorganPage from './WebDesignGorganPage';
import DoctorWebDesignGorganPage from './DoctorWebDesignGorganPage';
import CorporateWebDesignGorganPage from './CorporateWebDesignGorganPage';
import RestaurantWebDesignGorganPage from './RestaurantWebDesignGorganPage';
import WebDesignPriceGorganPage from './WebDesignPriceGorganPage';
import WebsiteSupportGorganPage from './WebsiteSupportGorganPage';
import PricingPage from './PricingPage';
import PortfolioPage from './PortfolioPage';
import RequestPage from './RequestPage';
import FreeWebsiteAuditPage from './FreeWebsiteAuditPage';
import { ArticlesIndexPage, ArticleDetailPage } from './ArticlesPage';
import { createElement } from 'react';
import type { SitePage } from './App';

// Server imports stay static; the browser loads these same components by page type.
// Prerendered HTML remains visible while the browser module is loading.
export function renderPage(page: SitePage, slug?: string) {
  switch (page) {
    case 'home': return null;
    case 'contact': return createElement(ContactPage);
    case 'seo-gorgan': return createElement(SeoGorganPage);
    case 'seo': return createElement(SeoPage);
    case 'web-design': return createElement(WebDesignPage);
    case 'web-design-gorgan': return createElement(WebDesignGorganPage);
    case 'doctor-web-design-gorgan': return createElement(DoctorWebDesignGorganPage);
    case 'corporate-web-design-gorgan': return createElement(CorporateWebDesignGorganPage);
    case 'restaurant-web-design-gorgan': return createElement(RestaurantWebDesignGorganPage);
    case 'web-design-price-gorgan': return createElement(WebDesignPriceGorganPage);
    case 'website-support-gorgan': return createElement(WebsiteSupportGorganPage);
    case 'pricing': return createElement(PricingPage);
    case 'portfolio': return createElement(PortfolioPage);
    case 'articles': return createElement(ArticlesIndexPage);
    case 'article': return createElement(ArticleDetailPage, { slug });
    case 'request': return createElement(RequestPage);
    case 'free-website-audit': return createElement(FreeWebsiteAuditPage);
  }
}
