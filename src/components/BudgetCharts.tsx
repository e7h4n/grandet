import { useLastResolved, useSet } from 'ccstate-react';
import { budgetCharts, createBudgetChart } from '../atoms/budget';
import { HTMLAttributes, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Card, CardHeader, Chip, Typography, useTheme } from '@mui/material';

function BudgetChartTitle({ chart }: { chart: ReturnType<typeof createBudgetChart> }) {
  const title = useLastResolved(chart.chartTitle$);
  const theme = useTheme();

  if (!title) return null;

  return (
    <Card elevation={0} sx={{ mb: 2 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                {title.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {title.latestDate.toISOString().slice(0, 10)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" component="span" sx={{ fontWeight: 'medium' }}>
                {title.latestValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                CNY
              </Typography>
              <Chip
                label={`${title.diff > 0 ? '+' : '-'}${Math.abs(title.diff).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                color={title.diff > 0 ? 'success' : 'error'}
                variant="outlined"
                size="small"
                title={`Expected: ${title.expected.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} CNY`}
              />
            </Box>
          </Box>
        }
        sx={{
          backgroundColor: theme.palette.grey[50],
          '& .MuiCardHeader-content': {
            width: '100%',
          },
        }}
      />
    </Card>
  );
}

function BudgetChart({
  chart: budgetChart,
  ...props
}: HTMLAttributes<HTMLDivElement> & { chart: ReturnType<typeof createBudgetChart> }) {
  const renderChart = useSet(budgetChart.renderChart$);

  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elemRef.current) return;
    const controller = new AbortController();
    renderChart(elemRef.current, controller.signal);
    return () => controller.abort();
  }, [renderChart]);

  return <div {...props} ref={elemRef}></div>;
}

export function BudgetCharts() {
  return (
    <Grid container spacing={2}>
      {budgetCharts.map((chart, idx) => {
        return (
          <Grid size={{ xs: 12 }} key={idx}>
            <BudgetChartTitle chart={chart} />
            <BudgetChart chart={chart} style={{ height: '300px' }}></BudgetChart>
          </Grid>
        );
      })}
    </Grid>
  );
}
