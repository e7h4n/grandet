import { $effect } from 'rippling';
import { beginAutoRefreshEffect } from './preference';
import { initRoutesEffect, navigateEffect } from './route';
import { updatePageEffect } from './react-router';
import { createElement } from 'react';
import HomePage from '../pages/Home';
import { LoginPage } from '../pages/Login';
import { authedAtom } from './auth';
import { SplashPage } from '../pages/Splash';
import CashFlowsPage from '../pages/CashFlows';
import { InvestmentsPage } from '../pages/Investments';
import { IrrPage } from '../pages/Irr';

const authGuardEffect = $effect(async (get, set, signal: AbortSignal) => {
  set(updatePageEffect, createElement(SplashPage));
  const authed = await get(authedAtom);
  signal.throwIfAborted();

  if (!authed) {
    set(navigateEffect, '/login');
    return false;
  }

  return true;
});

export const mainEffect = $effect((_, set, signal: AbortSignal) => {
  set(beginAutoRefreshEffect, signal);
  set(
    initRoutesEffect,
    [
      {
        path: '/',
        setup: $effect(async (_, set) => {
          if (!set(authGuardEffect, signal)) return;

          set(updatePageEffect, createElement(HomePage));
        }),
      },
      {
        path: '/cash_flows',
        setup: $effect(async (_, set) => {
          if (!set(authGuardEffect, signal)) return;

          set(updatePageEffect, createElement(CashFlowsPage));
        }),
      },
      {
        path: '/investments',
        setup: $effect(async (_, set) => {
          if (!set(authGuardEffect, signal)) return;

          set(updatePageEffect, createElement(InvestmentsPage));
        }),
      },
      {
        path: '/irr',
        setup: $effect(async (_, set) => {
          if (!set(authGuardEffect, signal)) return;

          set(updatePageEffect, createElement(IrrPage));
        }),
      },
      {
        path: '/login',
        setup: $effect((_, set) => {
          set(updatePageEffect, createElement(LoginPage));
        }),
      },
    ],
    signal,
  );
});
