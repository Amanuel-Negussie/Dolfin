import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithNavigate from "./utils/Auth0ProviderWithNavigate";
// import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>,
)
