import { $computed, $effect, $value } from 'rippling';
import { userAtom } from './auth';
import { interval } from 'signal-timers';
import { refreshEffect, reloadCalendarChart, reloadNavChart } from './portfolio';
const refreshAtom = $value(0);

export const showDetailNumberAtom = $computed((get) => {
  get(refreshAtom);
  return localStorage.getItem('showDetailNumber') === 'true';
});

export const setShowDetailNumberEffect = $effect((_, set, status: boolean) => {
  if (status) {
    localStorage.setItem('showDetailNumber', 'true');
  } else {
    localStorage.removeItem('showDetailNumber');
  }
  set(refreshAtom, (x) => x + 1);
});

export const autoRefreshAtom = $computed((get) => {
  get(refreshAtom);
  return localStorage.getItem('autoRefresh') === 'true';
});

export const updateAutoRefreshEffect = $effect((get, set, isEnabled: boolean) => {
  if (isEnabled) {
    localStorage.setItem('autoRefresh', 'true');
  } else {
    localStorage.removeItem('autoRefresh');
  }
  set(refreshAtom, (x) => x + 1);
  if (isEnabled) {
    set(beginAutoRefreshEffect);
  } else {
    get(autoReloadControllerAtom)?.abort();
  }
});

const autoReloadControllerAtom = $value<AbortController | undefined>(undefined);

export const beginAutoRefreshEffect = $effect(async (get, set) => {
  const isEnabled = get(autoRefreshAtom);
  if (!isEnabled) {
    return;
  }

  const user = await get(userAtom);
  if (!user) {
    return;
  }

  get(autoReloadControllerAtom)?.abort();
  const controller = new AbortController();
  set(autoReloadControllerAtom, controller);

  interval(
    async () => {
      set(refreshEffect);
      set(reloadNavChart, controller.signal);
      set(reloadCalendarChart, controller.signal);
    },
    1000 * 60 * 10, // 10 minutes
    { signal: controller.signal },
  );
});
