import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithNavigate from "./utils/Auth0ProviderWithNavigate";
import './index.css'
import { AccountsProvider } from './services/accounts';
import { InstitutionsProvider } from './services/institutions';
import { ItemsProvider } from './services/items';
import { LinkProvider } from './services/link';
import { TransactionsProvider } from './services/transactions';
import { UsersProvider } from './services/users';
import { CurrentUserProvider } from './services/currentUser';
import { AssetsProvider } from './services/assets';
import { ErrorsProvider } from './services/errors';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  //<React.StrictMode>

    <BrowserRouter>
      <Auth0ProviderWithNavigate>

        <InstitutionsProvider>
          <ItemsProvider>
            <LinkProvider>
              <AccountsProvider>
                <TransactionsProvider>
                  <ErrorsProvider>
                    <UsersProvider>
                      <CurrentUserProvider>
                        <AssetsProvider>
                          <App />
                        </AssetsProvider>
                      </CurrentUserProvider>
                    </UsersProvider>
                  </ErrorsProvider>
                </TransactionsProvider>
              </AccountsProvider>
            </LinkProvider>
          </ItemsProvider>
        </InstitutionsProvider>

      </Auth0ProviderWithNavigate>
    </BrowserRouter>

  //</React.StrictMode>
);
