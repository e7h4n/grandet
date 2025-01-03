import { useSet } from 'ccstate-react';
import { showAuthPage$ } from '../atoms/auth';
import { useEffect, useRef } from 'react';

export const LoginPage = () => {
  const elemRef = useRef<HTMLDivElement>(null);
  const showAuthPage = useSet(showAuthPage$);

  useEffect(() => {
    if (!elemRef.current) return;

    const ctrl = new AbortController();
    showAuthPage(elemRef.current, ctrl.signal);
    return () => ctrl.abort();
  }, [showAuthPage]);

  return <div ref={elemRef} />;
};
