import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';
import './readability.css';
import './liquid-glass.css';
import './header-scroll.css';
import './request.css';
import App from './App';

const root = document.getElementById('root')!;
hydrateRoot(root, <React.StrictMode><App page="request"/></React.StrictMode>);
