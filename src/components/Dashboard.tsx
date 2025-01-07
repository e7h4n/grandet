import { HTMLAttributes } from 'react';
import CalendarChart from './CalendarChart';
import NavIndexChart from './NavIndexChart';
import Summary from './Summary';
import Grid from '@mui/material/Grid2';
import CumulativeReturns from './CumulativeReturns';

export default function Dashboard(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <Grid container spacing={2} {...props}>
      <Grid size={12}>
        <Summary />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <NavIndexChart style={{ height: '300px' }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CalendarChart style={{ height: '300px' }} />
      </Grid>
      <Grid size={12}>
        <CumulativeReturns />
      </Grid>
    </Grid>
  );
}
