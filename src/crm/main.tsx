import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../fonts.css';
import '../liquid-glass.css';
import './crm.css';
import CrmApp from './CrmApp';

createRoot(document.getElementById('crm-root')!).render(<React.StrictMode><BrowserRouter><CrmApp/></BrowserRouter></React.StrictMode>);
