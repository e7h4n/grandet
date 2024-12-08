import { useLayoutEffect, useRef, HTMLAttributes } from 'react';
import { useSet } from 'rippling';
import { renderCalendarReturns } from '../atoms/portfolio';
import { Typography } from '@mui/material';

export default function CalendarChart(props: HTMLAttributes<HTMLDivElement>) {
  const elemRef = useRef<HTMLDivElement>(null);
  const renderChart = useSet(renderCalendarReturns);

  useLayoutEffect(() => {
    if (!elemRef.current) return;
    const controller = new AbortController();
    renderChart(elemRef.current, controller.signal);
    return () => controller.abort();
  }, [renderChart]);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Yearly IRR
      </Typography>
      <div {...props} ref={elemRef} />
    </>
  );
}
