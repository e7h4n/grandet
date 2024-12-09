import { $computed, $effect, $value, Effect } from 'rippling';

const reloadPathnameAtom = $value(0);
const pathnameAtom = $computed((get) => {
  get(reloadPathnameAtom);
  return window.location.pathname;
});

export const navigateEffect = $effect((_, set, pathname: string, signal?: AbortSignal) => {
  window.history.pushState({}, '', pathname);
  set(reloadPathnameAtom, (x) => x + 1);
  set(loadRouteEffect, signal);
});

interface Route {
  path: string;
  setup: Effect<void, [AbortSignal]>;
}

const inertnalRouteConfigAtom = $value<Route[] | undefined>(undefined);
export const currentRouteAtom = $computed((get) => {
  const config = get(inertnalRouteConfigAtom);
  if (!config) {
    return null;
  }

  const match = config.find((route) => route.path === get(pathnameAtom));
  if (!match) {
    return null;
  }
  return match;
});

const loadRouteControllerAtom = $value<AbortController | undefined>(undefined);
const loadRouteEffect = $effect((get, set, signal?: AbortSignal) => {
  get(loadRouteControllerAtom)?.abort();
  const currentRoute = get(currentRouteAtom);
  if (!currentRoute) {
    throw new Error('No route matches');
  }
  const controller = new AbortController();
  set(loadRouteControllerAtom, controller);
  set(currentRoute.setup, AbortSignal.any([controller.signal, signal].filter(Boolean) as AbortSignal[]));
});

export const initRoutesEffect = $effect((_, set, config: Route[], signal: AbortSignal) => {
  set(inertnalRouteConfigAtom, config);
  set(loadRouteEffect, signal);

  window.addEventListener(
    'popstate',
    () => {
      set(reloadPathnameAtom, (x) => x + 1);
      set(loadRouteEffect, signal);
    },
    { signal },
  );
});
