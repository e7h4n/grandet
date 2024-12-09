import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createStore, StoreProvider } from 'rippling';
import { Router } from './components/Router';
import { mainEffect } from './atoms/main';

async function prepare() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start();
  }

  return Promise.resolve();
}

void prepare().then(() => {
  const root = document.getElementById('root');
  if (root === null) {
    return;
  }

  const rootAbortController = new AbortController();
  const store = createStore();
  store.set(mainEffect, rootAbortController.signal);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <StoreProvider value={store}>
        <Router />
      </StoreProvider>
    </StrictMode>,
  );
});
