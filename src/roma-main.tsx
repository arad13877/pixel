import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './roma.css';
import RomaPage from './RomaPage';

hydrateRoot(document.getElementById('root')!, <React.StrictMode><RomaPage /></React.StrictMode>);
