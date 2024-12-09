import { ReactNode } from 'react';
import { $computed, $func, $value } from 'rippling';

const internalPage$ = $value<ReactNode | undefined>(undefined);

export const page$ = $computed((get) => {
  return get(internalPage$);
});

export const updatePage$ = $func(({ set }, page: ReactNode) => {
  set(internalPage$, page);
});
