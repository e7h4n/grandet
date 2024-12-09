import { useGet } from 'rippling';
import { page$ } from '../atoms/react-router';

export function Router() {
  return useGet(page$);
}
