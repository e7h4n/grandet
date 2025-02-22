import { computed, command, state } from 'ccstate';
import { user$ } from './auth';
import { interval } from 'signal-timers';
import { refresh$ as portfolioRefresh$, reloadCalendarChart$, reloadNavChart$ } from './portfolio';
import { refresh$ as balanceRefresh$ } from './balance';
import { refresh$ as budgetRefresh$ } from './budget';

const internalRefresh$ = state(0);

export const autoRefresh$ = computed((get) => {
  get(internalRefresh$);
  return localStorage.getItem('autoRefresh') === 'true';
});

export const updateAutoRefresh$ = command(({ get, set }, isEnabled: boolean) => {
  if (isEnabled) {
    localStorage.setItem('autoRefresh', 'true');
  } else {
    localStorage.removeItem('autoRefresh');
  }
  set(internalRefresh$, (x) => x + 1);
  if (isEnabled) {
    set(beginAutoRefresh$);
  } else {
    get(autoReloadController$)?.abort();
  }
});

const autoReloadController$ = state<AbortController | undefined>(undefined);

export const beginAutoRefresh$ = command(async ({ get, set }, signal?: AbortSignal) => {
  const isEnabled = get(autoRefresh$);
  if (!isEnabled) {
    return;
  }

  const user = await get(user$);
  if (!user) {
    return;
  }

  get(autoReloadController$)?.abort();
  const controller = new AbortController();
  set(autoReloadController$, controller);

  interval(
    async () => {
      set(refresh$, controller.signal);
    },
    1000 * 60 * 10, // 10 minutes
    { signal: AbortSignal.any([signal, controller.signal].filter(Boolean) as AbortSignal[]) },
  );
});

export const refresh$ = command(({ set }, signal?: AbortSignal) => {
  set(portfolioRefresh$);
  set(balanceRefresh$);
  set(budgetRefresh$);
  set(reloadNavChart$, signal);
  set(reloadCalendarChart$, signal);
});
