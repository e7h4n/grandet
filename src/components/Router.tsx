import { useGet } from 'rippling';
import { pageAtom } from '../atoms/react-router';

export function Router() {
  return useGet(pageAtom);
}
