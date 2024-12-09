import { useRef, HTMLAttributes, useEffect } from 'react';
import { useLoadable, useSet } from 'rippling';
import { navIndex, renderNavIndex } from '../atoms/portfolio';
import { Skeleton, Typography } from '@mui/material';

export default function NavIndexChart(props: HTMLAttributes<HTMLDivElement>) {
  const navIndex_ = useLoadable(navIndex);
  const elemRef = useRef<HTMLDivElement>(null);
  const renderChart = useSet(renderNavIndex);

  useEffect(() => {
    if (!elemRef.current) return;
    const controller = new AbortController();
    renderChart(elemRef.current, controller.signal);
    return () => controller.abort();
  }, [renderChart]);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        NAV
      </Typography>
      {navIndex_.state === 'hasData' ? (
        <div {...props} ref={elemRef} />
      ) : (
        <Skeleton
          variant="rectangular"
          height={300}
          sx={{
            borderRadius: 1,
            transform: 'none',
          }}
        />
      )}
    </>
  );
}
