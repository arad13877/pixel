import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './zero-line.css';
import ZeroLinePage from './ZeroLinePage';

hydrateRoot(document.getElementById('root')!, <React.StrictMode><ZeroLinePage /></React.StrictMode>);
