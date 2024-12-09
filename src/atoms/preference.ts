import { $computed, $func, $value } from 'rippling';
import { user$ } from './auth';
import { interval } from 'signal-timers';
import { refresh$, reloadCalendarChart$, reloadNavChart$ } from './portfolio';
const internalRefresh$ = $value(0);

export const showDetailNumber$ = $computed((get) => {
  get(internalRefresh$);
  return localStorage.getItem('showDetailNumber') === 'true';
});

export const setShowDetailNumber$ = $func(({ set }, status: boolean) => {
  if (status) {
    localStorage.setItem('showDetailNumber', 'true');
  } else {
    localStorage.removeItem('showDetailNumber');
  }
  set(internalRefresh$, (x) => x + 1);
});

export const autoRefresh$ = $computed((get) => {
  get(internalRefresh$);
  return localStorage.getItem('autoRefresh') === 'true';
});

export const updateAutoRefresh$ = $func(({ get, set }, isEnabled: boolean) => {
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

const autoReloadController$ = $value<AbortController | undefined>(undefined);

export const beginAutoRefresh$ = $func(async ({ get, set }, signal?: AbortSignal) => {
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
      set(refresh$);
      set(reloadNavChart$, controller.signal);
      set(reloadCalendarChart$, controller.signal);
    },
    1000 * 60 * 10, // 10 minutes
    { signal: AbortSignal.any([signal, controller.signal].filter(Boolean) as AbortSignal[]) },
  );
});
