import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './gorgan-khaneh.css';
import GorganKhanehPage from './GorganKhanehPage';

hydrateRoot(document.getElementById('root')!, <React.StrictMode><GorganKhanehPage /></React.StrictMode>);
