import { ReactNode } from 'react';
import { $computed, $effect, $value } from 'rippling';

const internalPageAtom = $value<ReactNode | undefined>(undefined);

export const pageAtom = $computed((get) => {
  return get(internalPageAtom);
});

export const updatePageEffect = $effect((_, set, page: ReactNode) => {
  set(internalPageAtom, page);
});
