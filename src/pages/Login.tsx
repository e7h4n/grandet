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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div ref={elemRef} />
    </div>
  );
};
