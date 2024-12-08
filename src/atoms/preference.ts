import { $computed, $effect, $value } from 'rippling';

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
