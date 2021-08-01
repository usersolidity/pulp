/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { App } from 'app';
import 'bootstrap/dist/css/bootstrap.min.css';
import FontFaceObserver from 'fontfaceobserver';
import * as React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import * as ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import reportWebVitals from 'reportWebVitals';
// Use consistent styling
import 'sanitize.css/sanitize.css';
import { configureAppStore } from 'store/configureStore';
import { ThemeProvider } from 'styles/theme/ThemeProvider';
// Initialize languages
import './locales/i18n';

// Observe loading of Inter (to remove 'Inter', remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Inter', {});

// When Inter is loaded, add a font-family using Inter to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

const store = configureAppStore();
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,

  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  OPTIMISM = 10,
  OPTIMISTIC_KOVAN = 69,
}

const NETWORK_POLLING_INTERVALS: { [chainId: number]: number } = {
  [SupportedChainId.ARBITRUM_ONE]: 1000,
  [SupportedChainId.ARBITRUM_RINKEBY]: 1000,
  [SupportedChainId.OPTIMISM]: 1000,
  [SupportedChainId.OPTIMISTIC_KOVAN]: 1000,
};

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, typeof provider.chainId === 'number' ? provider.chainId : typeof provider.chainId === 'string' ? parseInt(provider.chainId) : 'any');
  library.pollingInterval = 15_000;
  library.detectNetwork().then(network => {
    const networkPollingInterval = NETWORK_POLLING_INTERVALS[network.chainId];
    if (networkPollingInterval) {
      console.debug('Setting polling interval', networkPollingInterval);
      library.pollingInterval = networkPollingInterval;
    }
  });
  return library;
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Provider store={store}>
      <ThemeProvider>
        <HelmetProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  </Web3ReactProvider>,
  MOUNT_NODE,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
