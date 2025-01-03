import { useGet, useLastLoadable, useSet } from 'ccstate-react';
import { pnl$, irrSummary$, navIndex$ } from '../atoms/portfolio';
import { Card, CardContent, IconButton, Skeleton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { setShowDetailNumber$, showDetailNumber$ } from '../atoms/preference';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { current$ } from '../atoms/balance';

function SkeletonCard() {
  return (
    <Grid size={{ xs: 6, md: 3 }}>
      <Card>
        <CardContent>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
        </CardContent>
      </Card>
    </Grid>
  );
}

export default function Summary() {
  const pnl_ = useLastLoadable(pnl$);
  const irrSummary_ = useLastLoadable(irrSummary$);
  const navIndex_ = useLastLoadable(navIndex$);
  const current_ = useLastLoadable(current$);
  const showDetailNumber = useGet(showDetailNumber$);
  const updateShowDetailNumber = useSet(setShowDetailNumber$);

  if (
    pnl_.state !== 'hasData' ||
    irrSummary_.state !== 'hasData' ||
    navIndex_.state !== 'hasData' ||
    current_.state !== 'hasData'
  ) {
    return (
      <Grid container spacing={2}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Grid>
    );
  }

  const pnlData = pnl_.data;
  const irrData = irrSummary_.data;
  const latestNavIndex = navIndex_.data[navIndex_.data.length - 1];
  const total_pnl = pnlData.realizedPnlExFee + pnlData.unrealizedPnl + pnlData.dividendExTax;

  const renderCard = (title: string, value: string | number, isPositive: boolean, numberTitle: string) => (
    <Grid size={{ xs: 6, md: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: isPositive ? 'success.main' : 'error.main',
              fontWeight: 'bold',
            }}
          >
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            {numberTitle}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Grid container spacing={2}>
      {renderCard(
        'Current',
        (current_.data[1] as number).toFixed(2),
        (current_.data[1] as number) > 0,
        `Current at ${(current_.data[0] as Date).toLocaleDateString()}`,
      )}
      <Grid size={{ xs: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              Total PnL
              <IconButton size="small" onClick={() => updateShowDetailNumber(!showDetailNumber)} sx={{ ml: 0 }}>
                {showDetailNumber ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: total_pnl > 0 ? 'success.main' : 'error.main',
                fontWeight: 'bold',
              }}
            >
              {pnlData.currency}{' '}
              {showDetailNumber ? total_pnl.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '***'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
              Including {pnlData.currency}{' '}
              {showDetailNumber ? pnlData.dividendExTax.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '***'}{' '}
              in dividends
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {renderCard(
        'Nav Index',
        latestNavIndex[1].toFixed(2),
        latestNavIndex[1] > 0,
        `Yearly ${(Math.pow(latestNavIndex[1], 1 / irrData.years) * 100 - 100).toFixed(2)}% over ${irrData.years.toFixed(1)} years`,
      )}
      {renderCard(
        'IRR',
        `${(irrData.total_returns * 100).toFixed(2)}%`,
        irrData.total_returns > 0,
        `Include ${(irrData.div_returns * 100).toFixed(2)}% in dividends`,
      )}
    </Grid>
  );
}
