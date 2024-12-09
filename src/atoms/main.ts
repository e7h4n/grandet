import { $effect } from 'rippling';
import { beginAutoRefreshEffect } from './preference';
import { initRoutesEffect, navigateEffect } from './route';
import { updatePageEffect } from './react-router';
import { createElement } from 'react';
import App from '../App';
import { AuthPage } from '../components/AuthPage';
import { authedAtom } from './auth';

export const mainEffect = $effect((_, set, signal: AbortSignal) => {
  set(beginAutoRefreshEffect, signal);
  set(
    initRoutesEffect,
    [
      {
        path: '/',
        setup: $effect(async (get, set) => {
          set(updatePageEffect, createElement(App));

          const authed = await get(authedAtom);
          if (!authed) {
            set(navigateEffect, '/login');
          }
        }),
      },
      {
        path: '/login',
        setup: $effect((_, set) => {
          set(updatePageEffect, createElement(AuthPage));
        }),
      },
    ],
    signal,
  );
});
