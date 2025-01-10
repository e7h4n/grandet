import { command, computed, state } from 'ccstate';

const internalRefresh$ = state(0);

export const serverSource$ = computed((get) => {
  get(internalRefresh$);

  if (localStorage.getItem('serverSource')) {
    return localStorage.getItem('serverSource') as 'remote' | 'local';
  }

  return 'remote';
});
export const switchServerSource$ = command(({ set }, source: 'remote' | 'local') => {
  localStorage.setItem('serverSource', source);
  set(internalRefresh$, (x) => x + 1);
});

export const apiHost$ = computed((get) => {
  const source = get(serverSource$);
  return source === 'remote' ? 'https://bean.elmz.life' : 'http://127.0.0.1:5000';
});
