import { useRef, HTMLAttributes, useEffect } from 'react';
import { useLastLoadable, useSet } from 'ccstate-react';
import { calendarReturns$, renderCalendarReturns$ } from '../atoms/portfolio';
import { Skeleton, Typography, Card, CardContent } from '@mui/material';

export default function CalendarChart(props: HTMLAttributes<HTMLDivElement>) {
  const calendarData_ = useLastLoadable(calendarReturns$);
  const elemRef = useRef<HTMLDivElement>(null);
  const renderChart = useSet(renderCalendarReturns$);

  useEffect(() => {
    if (!elemRef.current) return;
    const controller = new AbortController();
    renderChart(elemRef.current, controller.signal);
    return () => controller.abort();
  }, [renderChart]);

  return (
    <Card>
      <CardContent
        sx={{
          py: 1.5,
          px: 1.5,
          '&:last-child': {
            pb: 1.5,
          },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: '1.25rem',
            color: 'text.secondary',
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          Yearly Performance
        </Typography>
        {calendarData_.state === 'hasData' ? (
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
      </CardContent>
    </Card>
  );
}
