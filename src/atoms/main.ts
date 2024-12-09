import { $func } from 'rippling';
import { beginAutoRefresh$ } from './preference';
import { updatePage$ } from './react-router';
import { createElement } from 'react';
import HomePage from '../pages/Home';
import { LoginPage } from '../pages/Login';
import { authed$ } from './auth';
import { SplashPage } from '../pages/Splash';
import CashFlowsPage from '../pages/CashFlows';
import { InvestmentsPage } from '../pages/Investments';
import { IrrPage } from '../pages/Irr';
import { initRoutes$, navigate$ } from './route';

const authGuard$ = $func(async ({ get, set }, signal: AbortSignal) => {
  set(updatePage$, createElement(SplashPage));
  const authed = await get(authed$);
  signal.throwIfAborted();

  if (!authed) {
    set(navigate$, '/login');
    return false;
  }

  return true;
});

export const main$ = $func(({ set }, signal: AbortSignal) => {
  set(beginAutoRefresh$, signal);
  set(
    initRoutes$,
    [
      {
        path: '/',
        setup: $func(async ({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(HomePage));
        }),
      },
      {
        path: '/cash_flows',
        setup: $func(async ({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(CashFlowsPage));
        }),
      },
      {
        path: '/investments',
        setup: $func(async ({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(InvestmentsPage));
        }),
      },
      {
        path: '/irr',
        setup: $func(async ({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(IrrPage));
        }),
      },
      {
        path: '/login',
        setup: $func(({ set }) => {
          set(updatePage$, createElement(LoginPage));
        }),
      },
    ],
    signal,
  );
});
