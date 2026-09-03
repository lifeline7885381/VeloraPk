import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Guard against third-party extension injection errors (MetaMask, phantom, EVM wallets)
// which fail when injected into sandboxed iframes without ethereum providers
if (typeof window !== 'undefined') {
  const isExtensionError = (message?: string) => {
    if (!message) return false;
    const lower = message.toLowerCase();
    return (
      lower.includes('metamask') ||
      lower.includes('ethereum') ||
      lower.includes('failed to connect') ||
      lower.includes('web3') ||
      lower.includes('wallet') ||
      lower.includes('chrome-extension://') ||
      lower.includes('moz-extension://')
    );
  };

  window.addEventListener(
    'error',
    (event) => {
      const msg = event.message || event.error?.message;
      if (isExtensionError(msg)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reasonMsg =
        event.reason?.message || (typeof event.reason === 'string' ? event.reason : '');
      if (isExtensionError(reasonMsg)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
