import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createDebugStore, createStore, Store } from 'ccstate';
import { StoreProvider } from 'ccstate-react';
import { Router } from './components/Router';
import { main$ } from './atoms/main';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    // 可以针对特定变体设置字重
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      color: '#111827',
    },
    body2: {
      color: '#111827',
    },
  },
});

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
    store = createDebugStore();
  } else {
    store = createStore();
  }

  store.set(main$, rootAbortController.signal);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <StoreProvider value={store}>
          <Router />
        </StoreProvider>
      </ThemeProvider>
    </StrictMode>,
  );
});
