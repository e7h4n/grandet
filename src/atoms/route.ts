import { computed, command, state, Command } from 'ccstate';

const reloadPathname$ = state(0);
const pathname$ = computed((get) => {
  get(reloadPathname$);
  return window.location.pathname;
});

export const navigate$ = command(({ set }, pathname: string, signal?: AbortSignal) => {
  window.history.pushState({}, '', pathname);
  set(reloadPathname$, (x) => x + 1);
  set(loadRoute$, signal);
});

interface Route {
  path: string;
  setup: Command<void, [AbortSignal]>;
}

const inertnalRouteConfig$ = state<Route[] | undefined>(undefined);
export const currentRoute$ = computed((get) => {
  const config = get(inertnalRouteConfig$);
  if (!config) {
    return null;
  }

  const match = config.find((route) => route.path === get(pathname$));
  if (!match) {
    return null;
  }
  return match;
});

const loadRouteController$ = state<AbortController | undefined>(undefined);
const loadRoute$ = command(({ get, set }, signal?: AbortSignal) => {
  get(loadRouteController$)?.abort();
  const currentRoute = get(currentRoute$);
  if (!currentRoute) {
    throw new Error('No route matches');
  }
  const controller = new AbortController();
  set(loadRouteController$, controller);
  set(currentRoute.setup, AbortSignal.any([controller.signal, signal].filter(Boolean) as AbortSignal[]));
});

export const initRoutes$ = command(({ set }, config: Route[], signal: AbortSignal) => {
  set(inertnalRouteConfig$, config);
  set(loadRoute$, signal);

  window.addEventListener(
    'popstate',
    () => {
      set(reloadPathname$, (x) => x + 1);
      set(loadRoute$, signal);
    },
    { signal },
  );
});
