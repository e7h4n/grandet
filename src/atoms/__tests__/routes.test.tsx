import { StrictMode } from 'react';
import { command, createStore } from 'ccstate';
import { StoreProvider } from 'ccstate-react';
import { expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Router } from '../../components/Router';
import { initRoutes$, navigate$ } from '../route';
import { updatePage$ } from '../react-router';

it('routes should render correct page', async () => {
  const controller = new AbortController();
  const store = createStore();

  store.set(
    initRoutes$,
    [
      {
        path: '/',
        setup: command(({ set }) => {
          set(updatePage$, <div>home</div>);
        }),
      },
    ],
    controller.signal,
  );

  render(
    <StrictMode>
      <StoreProvider value={store}>
        <Router />
      </StoreProvider>
    </StrictMode>,
  );

  expect(screen.getByText('home')).toBeTruthy();
  cleanup();
  controller.abort();
});

it('navigate should goto correct page', async () => {
  const controller = new AbortController();
  const store = createStore();

  store.set(
    initRoutes$,
    [
      {
        path: '/',
        setup: command(({ set }) => {
          set(updatePage$, <div>home</div>);
        }),
      },
      {
        path: '/login',
        setup: command(({ set }) => {
          set(updatePage$, <div>login</div>);
        }),
      },
    ],
    controller.signal,
  );

  render(
    <StrictMode>
      <StoreProvider value={store}>
        <Router />
      </StoreProvider>
    </StrictMode>,
  );

  store.set(navigate$, '/login');

  expect(await screen.findByText('login')).toBeTruthy();
  cleanup();
  controller.abort();
});

it('history back should goto correct page', async () => {
  const controller = new AbortController();
  const store = createStore();

  store.set(
    initRoutes$,
    [
      {
        path: '/',
        setup: command(({ set }) => {
          set(updatePage$, <div>home</div>);
        }),
      },
      {
        path: '/login',
        setup: command(({ set }) => {
          set(updatePage$, <div>login</div>);
        }),
      },
    ],
    controller.signal,
  );

  render(
    <StrictMode>
      <StoreProvider value={store}>
        <Router />
      </StoreProvider>
    </StrictMode>,
  );

  store.set(navigate$, '/login');

  expect(await screen.findByText('login')).toBeTruthy();

  window.history.back();
  vi.spyOn(window, 'location', 'get').mockReturnValue({
    pathname: '/',
  } as Location);
  fireEvent.popState(window, { pathname: '/' });

  expect(await screen.findByText('home')).toBeTruthy();

  cleanup();
  controller.abort();
});
