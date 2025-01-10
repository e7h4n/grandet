import { computed, command, state } from 'ccstate';
import Corbado from '@corbado/web-js';
import { navigate$ } from './route';
import { serverSource$ } from './api';

const reload$ = state(0);
const corbado$ = computed(async (get) => {
  get(reload$);

  return await Corbado.load({
    projectId: 'pro-8910668211600497001',
  }).then(() => Corbado);
});

export const showAuthPage$ = command(async ({ get, set }, elem: HTMLDivElement, signal: AbortSignal) => {
  const corbado = await get(corbado$);
  corbado.mountAuthUI(elem, {
    onLoggedIn: () => {
      set(onAuth$);
    },
  });

  signal.addEventListener('abort', () => {
    corbado.unmountAuthUI(elem);
  });
});

export const user$ = computed(async (get) => {
  const corbado = await get(corbado$);
  if (!corbado.user) {
    return undefined;
  }
  return (await corbado.getFullUser()).unwrap();
});

export const authed$ = computed(async (get) => {
  return !!(await get(user$));
});

export const onAuth$ = command(({ set }) => {
  set(reload$, (x) => x + 1);
  set(navigate$, '/');
});

export const logout$ = command(async ({ get, set }) => {
  const corbado = await get(corbado$);
  await corbado.logout();
  set(reload$, (x) => x + 1);
  set(navigate$, '/login');
});

export const sessionToken$ = computed(async (get) => {
  const corbado = await get(corbado$);
  return corbado.sessionToken;
});

export const sessionHeaders$ = computed(async (get) => {
  const token = await get(sessionToken$);
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  if (get(serverSource$) === 'local') {
    headers.append('X-Debug-User', 'true');
  }
  return headers;
});
