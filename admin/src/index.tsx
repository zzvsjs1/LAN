import React from 'react';
import ReactDOM from 'react-dom/client';
import { LanThemeContextProvider } from "./common/LanThemeContext";
import { BrowserRouter } from "react-router-dom";
import App from './App';
import { SubscriptionContextProvider } from "./common/SubscriptionContext";

import reportWebVitals from './reportWebVitals';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SubscriptionContextProvider>
        <LanThemeContextProvider>
          <App />
        </LanThemeContextProvider>
      </SubscriptionContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
