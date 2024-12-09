import { StrictMode } from 'react';
import { $effect, createStore, StoreProvider } from 'rippling';
import { expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Router } from '../../components/Router';
import { initRoutesEffect, navigateEffect } from '../route';
import { updatePageEffect } from '../react-router';

it('routes should render correct page', async () => {
  const controller = new AbortController();
  const store = createStore();

  store.set(
    initRoutesEffect,
    [
      {
        path: '/',
        setup: $effect((_, set) => {
          set(updatePageEffect, <div>home</div>);
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
    initRoutesEffect,
    [
      {
        path: '/',
        setup: $effect((_, set) => {
          set(updatePageEffect, <div>home</div>);
        }),
      },
      {
        path: '/login',
        setup: $effect((_, set) => {
          set(updatePageEffect, <div>login</div>);
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

  store.set(navigateEffect, '/login');

  expect(await screen.findByText('login')).toBeTruthy();
  cleanup();
  controller.abort();
});

it('history back should goto correct page', async () => {
  const controller = new AbortController();
  const store = createStore();

  store.set(
    initRoutesEffect,
    [
      {
        path: '/',
        setup: $effect((_, set) => {
          set(updatePageEffect, <div>home</div>);
        }),
      },
      {
        path: '/login',
        setup: $effect((_, set) => {
          set(updatePageEffect, <div>login</div>);
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

  store.set(navigateEffect, '/login');

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
