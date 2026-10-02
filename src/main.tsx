import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import { loadPage } from './page-loader';

const root = document.getElementById('root')!;
const page = root.dataset.page === 'free-website-audit' ? 'free-website-audit' : root.dataset.page === 'restaurant-web-design-gorgan' ? 'restaurant-web-design-gorgan' : root.dataset.page === 'website-support-gorgan' ? 'website-support-gorgan' : root.dataset.page === 'web-design-price-gorgan' ? 'web-design-price-gorgan' : root.dataset.page === 'corporate-web-design-gorgan' ? 'corporate-web-design-gorgan' : root.dataset.page === 'doctor-web-design-gorgan' ? 'doctor-web-design-gorgan' : root.dataset.page === 'pricing' ? 'pricing' : root.dataset.page === 'web-design-gorgan' ? 'web-design-gorgan' : root.dataset.page === 'web-design' ? 'web-design' : root.dataset.page === 'portfolio' ? 'portfolio' : root.dataset.page === 'articles' ? 'articles' : root.dataset.page === 'article' ? 'article' : root.dataset.page === 'request' ? 'request' : 'home';
void loadPage(page, root.dataset.articleSlug).then(content => {
  hydrateRoot(root, <React.StrictMode><App page={page} content={content}/></React.StrictMode>);
});
