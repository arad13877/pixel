import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './nilora.css';
import NiloraPage from './NiloraPage';

hydrateRoot(document.getElementById('root')!, <React.StrictMode><NiloraPage /></React.StrictMode>);
