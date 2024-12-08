import { useLayoutEffect, useRef, HTMLAttributes } from 'react';
import { useSet } from 'rippling';
import { renderCalendarReturns } from '../atoms/portfolio';

export default function CalendarChart(props: HTMLAttributes<HTMLDivElement>) {
  const elemRef = useRef<HTMLDivElement>(null);
  const renderChart = useSet(renderCalendarReturns);

  useLayoutEffect(() => {
    if (!elemRef.current) return;
    renderChart(elemRef.current);
  });

  return (
    <>
      <div {...props} ref={elemRef} />
    </>
  );
}
