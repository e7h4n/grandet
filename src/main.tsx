import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createDebugStore, StoreProvider, setupDevtoolsInterceptor, createStore, Store } from 'rippling';
import { Router } from './components/Router';
import { main$ } from './atoms/main';

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
  let store: Store;
  if (import.meta.env.DEV) {
    const interceptor = setupDevtoolsInterceptor(window);
    store = createDebugStore(interceptor);
  } else {
    store = createStore();
  }

  store.set(main$, rootAbortController.signal);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <StoreProvider value={store}>
        <Router />
      </StoreProvider>
    </StrictMode>,
  );
});
