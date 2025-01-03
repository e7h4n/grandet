import { computed } from 'ccstate';

export const apiHost$ = computed(() => {
  return window.location.hostname === 'localhost' ? 'http://127.0.0.1:5000' : 'https://bean.elmz.life';
});
