import { useLastResolved, useSet } from 'ccstate-react';
import { budgetCharts, createBudgetChart, summary$ } from '../atoms/budget';
import { HTMLAttributes, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Card, CardHeader, Chip, Typography, useTheme } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function BudgetChartTitle({ chart }: { chart: ReturnType<typeof createBudgetChart> }) {
  const title = useLastResolved(chart.chartMeta$);
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
  const theme = useTheme();
  const summary = useLastResolved(summary$);
  if (!summary) return null;

  const remainingBudget = summary.currentBudget - summary.currentExpense;
  const progressPercent = (summary.currentExpense / summary.currentBudget) * 100;

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.light + '20',
                  }}
                >
                  <MonetizationOnIcon />
                </Box>
              }
              title={
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 0.5,
                    }}
                  >
                    Current Expenses
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {summary.currentExpense.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    CNY
                  </Typography>
                </Box>
              }
              sx={{
                '& .MuiCardHeader-content': {
                  overflow: 'hidden',
                },
              }}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={
                <Box
                  sx={{
                    color: theme.palette.warning.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.warning.light + '20',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
              }
              title={
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 0.5,
                    }}
                  >
                    Projected Budget
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {summary.currentBudget.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    CNY
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'block',
                    }}
                  >
                    {progressPercent.toFixed(1)}% Utilized
                  </Typography>
                </Box>
              }
              sx={{
                '& .MuiCardHeader-content': {
                  overflow: 'hidden',
                },
              }}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={
                <Box
                  sx={{
                    color: remainingBudget > 0 ? theme.palette.success.main : theme.palette.error.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor:
                      (remainingBudget > 0 ? theme.palette.success.light : theme.palette.error.light) + '20',
                  }}
                >
                  <AccountBalanceWalletIcon />
                </Box>
              }
              title={
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 0.5,
                    }}
                  >
                    Remaining Balance
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: remainingBudget > 0 ? theme.palette.success.main : theme.palette.error.main,
                    }}
                  >
                    {Math.abs(remainingBudget).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    CNY
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'block',
                    }}
                  >
                    {remainingBudget > 0 ? 'Under Budget' : 'Over Budget'}
                  </Typography>
                </Box>
              }
              sx={{
                '& .MuiCardHeader-content': {
                  overflow: 'hidden',
                },
              }}
            />
          </Card>
        </Grid>
      </Grid>
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
    </>
  );
}
