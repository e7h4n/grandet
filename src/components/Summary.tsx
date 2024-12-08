import { useLoadable } from 'rippling';
import { pnl, irrSummary, navIndex } from '../atoms/portfolio';
import { Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default function Summary() {
  const pnl_ = useLoadable(pnl);
  const irrSummary_ = useLoadable(irrSummary);
  const navIndex_ = useLoadable(navIndex);

  if (pnl_.state !== 'hasData' || irrSummary_.state !== 'hasData' || navIndex_.state !== 'hasData') {
    return <div>Loading...</div>;
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
        'Total PnL',
        pnlData.currency +
          ' ' +
          total_pnl.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          }),
        total_pnl > 0,
        `Including ${pnlData.currency} ${pnlData.dividendExTax.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })} in dividends`,
      )}
      {renderCard(
        'Nav Index',
        latestNavIndex[1].toFixed(2),
        latestNavIndex[1] > 0,
        `Latest NAV Index in ${latestNavIndex[0].toLocaleDateString()}`,
      )}
      {renderCard(
        'Yearly Nav',
        `${(Math.pow(latestNavIndex[1], 1 / irrData.years) * 100 - 100).toFixed(2)}%`,
        latestNavIndex[1] > 0,
        `Total returns over ${irrData.years.toFixed(1)} years`,
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
