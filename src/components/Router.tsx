import { useGet } from 'ccstate-react';
import { page$ } from '../atoms/react-router';

export function Router() {
  return useGet(page$);
}
