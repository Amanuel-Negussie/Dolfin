import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithNavigate from "./utils/Auth0ProviderWithNavigate";
// import './index.css'

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Create a root and render the application
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <App />
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </React.StrictMode>
  );
}
