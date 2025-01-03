import { computed, command, state } from 'ccstate';
import { sessionHeaders$ } from './auth';
import { apiHost$ } from './api';

const internalRefresh$ = state(0);

export const refresh$ = command(({ set }) => {
  set(internalRefresh$, (x) => x + 1);
});

export const current$ = computed(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  const resp = await fetch(apiHost + '/balance/current', { headers });
  const data = await resp.json();
  return [new Date(data[0]), parseFloat(data[1])];
});

export const short_assets$ = computed(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  const resp = await fetch(apiHost + '/balance/short_assets', { headers });
  const data = await resp.json();
  return data.map(([dateStr, indexStr]: [string, string]) => {
    return [new Date(dateStr), parseFloat(indexStr)];
  });
});

export const investments$ = computed(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  const resp = await fetch(apiHost + '/balance/investments', { headers });
  const data = await resp.json();
  return data.map(([dateStr, indexStr]: [string, string]) => {
    return [new Date(dateStr), parseFloat(indexStr)];
  });
});
