import { ReactNode } from 'react';
import { computed, command, state } from 'ccstate';

const internalPage$ = state<ReactNode | undefined>(undefined);

export const page$ = computed((get) => {
  return get(internalPage$);
});

export const updatePage$ = command(({ set }, page: ReactNode) => {
  set(internalPage$, page);
});
