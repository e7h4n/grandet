import { useSet } from 'rippling';
import { showAuthPageEffect } from '../atoms/auth';
import { useEffect, useRef } from 'react';

export const LoginPage = () => {
  const elemRef = useRef<HTMLDivElement>(null);
  const showAuthPage = useSet(showAuthPageEffect);

  useEffect(() => {
    if (!elemRef.current) return;

    const ctrl = new AbortController();
    showAuthPage(elemRef.current, ctrl.signal);
    return () => ctrl.abort();
  }, [showAuthPage]);

  return <div ref={elemRef} />;
};
