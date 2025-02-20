import { useGet, useLastLoadable, useSet } from 'ccstate-react';
import { pnl$, irrSummary$, navIndex$, shortAssets$, holding$ } from '../atoms/portfolio';
import { Card, CardContent, IconButton, Skeleton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { setShowDetailNumber$, showDetailNumber$ } from '../atoms/preference';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { current$ } from '../atoms/balance';

function SkeletonCard() {
  return (
    <Grid size={{ xs: 6, md: 2 }}>
      <Card>
        <CardContent sx={{ p: 1.5 }}>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '0.75rem' }} />
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
  const shortAssets = useLastLoadable(shortAssets$);
  const updateShowDetailNumber = useSet(setShowDetailNumber$);
  const holdingData = useLastLoadable(holding$);

  if (
    pnl_.state !== 'hasData' ||
    irrSummary_.state !== 'hasData' ||
    navIndex_.state !== 'hasData' ||
    current_.state !== 'hasData' ||
    shortAssets.state !== 'hasData' ||
    holdingData.state !== 'hasData'
  ) {
    return (
      <Grid container spacing={2}>
        <SkeletonCard />
        <SkeletonCard />
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
  const shortAssetsChanged = shortAssets.data[1][1] - shortAssets.data[0][1];

  const renderCard = (title: string, value: string | number, isPositive: boolean, numberTitle: string) => (
    <Grid size={{ xs: 6, md: 2 }}>
      <Card>
        <CardContent sx={{ p: 1.5 }}>
          <Typography sx={{ fontSize: '0.9rem' }} component="div">
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: isPositive ? 'success.main' : 'error.main',
              fontWeight: 'bold',
            }}
            component="div"
          >
            {value}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem' }} color="text.secondary">
            {numberTitle}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Grid container spacing={1}>
      {renderCard(
        'Current',
        (current_.data[1] as number).toFixed(2),
        (current_.data[1] as number) > 0,
        `Current at ${(current_.data[0] as Date).toLocaleDateString()}`,
      )}
      <Grid size={{ xs: 6, md: 2 }}>
        <Card>
          <CardContent sx={{ p: 1.5 }}>
            <Typography sx={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center' }} component="div">
              Total PnL
              <IconButton size="small" onClick={() => updateShowDetailNumber(!showDetailNumber)} sx={{ ml: 0 }}>
                {showDetailNumber ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Typography>
            <Typography
              sx={{
                fontSize: '1.1rem',
                color: total_pnl > 0 ? 'success.main' : 'error.main',
                fontWeight: 'bold',
              }}
              component="div"
            >
              {pnlData.currency}{' '}
              {showDetailNumber ? total_pnl.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '***'}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem' }} color="text.secondary">
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
      {renderCard(
        'Short Assets',
        (shortAssetsChanged > 0 ? '+' : '-') + shortAssetsChanged.toFixed(2),
        shortAssetsChanged > 0,
        'Current short term assets',
      )}
      {renderCard(
        'Daily Change',
        parseFloat(holdingData.data.today_market_value_change[0]).toFixed(2),
        parseFloat(holdingData.data.today_market_value_change[0]) > 0,
        'Today investment change',
      )}
    </Grid>
  );
}
