import Grid from '@mui/material/Grid2';
import { AssetCard } from './cards/AssetCard';
import { PnLCard } from './cards/PnLCard';
import { IrrCard } from './cards/IrrCard';
import { NavCard } from './cards/NavCard';
import { DailyChangeCard } from './cards/DailyChangeCard';

export default function Summary() {
  return (
    <Grid container spacing={1}>
      <AssetCard />
      <PnLCard />
      <IrrCard />
      <NavCard />
      <DailyChangeCard />
    </Grid>
  );
}
