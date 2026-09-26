import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './veloma.css';
import VelomaPage from './VelomaPage';

hydrateRoot(document.getElementById('root')!, <React.StrictMode><VelomaPage /></React.StrictMode>);
