import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';
import './readability.css';
import './web-design.css';
import './liquid-glass.css';
import './header-scroll.css';
import './hero-enhancements.css';
import './portfolio.css';
import './home-refresh.css';
import './articles.css';
import './request.css';
import App from './App';

const root = document.getElementById('root')!;
const page = root.dataset.page === 'web-design' ? 'web-design' : root.dataset.page === 'portfolio' ? 'portfolio' : root.dataset.page === 'articles' ? 'articles' : root.dataset.page === 'article' ? 'article' : root.dataset.page === 'request' ? 'request' : 'home';
hydrateRoot(root, <React.StrictMode><App page={page} articleSlug={root.dataset.articleSlug}/></React.StrictMode>);
