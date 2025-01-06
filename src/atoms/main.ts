import { command } from 'ccstate';
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
import { BudgetPage } from '../pages/Budget';
import HoldingPage from '../pages/Holding';

const authGuard$ = command(async ({ get, set }, signal: AbortSignal) => {
  set(updatePage$, createElement(SplashPage));
  const authed = await get(authed$);
  signal.throwIfAborted();

  if (!authed) {
    set(navigate$, '/login');
    return false;
  }

  return true;
});

export const main$ = command(({ set }, signal: AbortSignal) => {
  set(beginAutoRefresh$, signal);
  set(
    initRoutes$,
    [
      {
        path: '/',
        setup: command(async ({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(HomePage));
        }),
      },
      {
        path: '/cash_flows',
        setup: command(async ({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(CashFlowsPage));
        }),
      },
      {
        path: '/investments',
        setup: command(async ({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(InvestmentsPage));
        }),
      },
      {
        path: '/irr',
        setup: command(async ({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(IrrPage));
        }),
      },
      {
        path: '/login',
        setup: command(({ set }) => {
          set(updatePage$, createElement(LoginPage));
        }),
      },
      {
        path: '/budget',
        setup: command(({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(BudgetPage));
        }),
      },
      {
        path: '/holdings',
        setup: command(({ set }) => {
          if (!set(authGuard$, signal)) return;

          set(updatePage$, createElement(HoldingPage));
        }),
      },
    ],
    signal,
  );
});
