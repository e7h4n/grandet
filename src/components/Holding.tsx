import Grid from '@mui/material/Grid2';
import { HoldingSummary } from './HoldingSummary';
import { HoldingList } from './HoldingList';
import { HoldingDistribution } from './HoldingDistribution';

export function Holding() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <HoldingSummary />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <HoldingList />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <HoldingDistribution />
      </Grid>
    </Grid>
  );
}
