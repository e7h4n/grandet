import { useRef, HTMLAttributes, useEffect } from 'react';
import { useLastLoadable, useSet } from 'rippling';
import { calendarReturns$, renderCalendarReturns$ } from '../atoms/portfolio';
import { Skeleton, Typography } from '@mui/material';

export default function CalendarChart(props: HTMLAttributes<HTMLDivElement>) {
  const data_ = useLastLoadable(calendarReturns$);
  const elemRef = useRef<HTMLDivElement>(null);
  const renderChart = useSet(renderCalendarReturns$);

  useEffect(() => {
    if (!elemRef.current) return;
    const controller = new AbortController();
    renderChart(elemRef.current, controller.signal);
    return () => controller.abort();
  }, [renderChart]);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        IRR
      </Typography>
      {data_.state === 'hasData' ? (
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
