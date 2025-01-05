import { useLastResolved, useSet } from 'ccstate-react';
import { budgetCharts, createBudgetChart, summary$ } from '../atoms/budget';
import { HTMLAttributes, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Card, CardHeader, Chip, Typography, useTheme, LinearProgress } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShowChartIcon from '@mui/icons-material/ShowChart';

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

function BudgetProgressBar({ percent, showOverBudget = true }: { percent: number; showOverBudget?: boolean }) {
  const theme = useTheme();
  const isOverBudget = percent > 100;
  const displayPercent = showOverBudget ? percent : Math.min(percent, 100);

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ flex: 1, position: 'relative' }}>
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{
              height: 6,
              borderRadius: 1,
              backgroundColor: theme.palette.grey[100],
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.grey[200],
              },
            }}
          />
          <LinearProgress
            variant="determinate"
            value={Math.min(displayPercent, 100)}
            sx={{
              height: 6,
              borderRadius: 1,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              backgroundColor: 'transparent',
              '& .MuiLinearProgress-bar': {
                backgroundColor: isOverBudget ? theme.palette.error.main : theme.palette.warning.main,
              },
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{
            ml: 1,
            color: isOverBudget ? theme.palette.error.main : theme.palette.text.secondary,
            minWidth: 45,
            fontWeight: isOverBudget ? 600 : 400,
          }}
        >
          {percent.toFixed(1)}%
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: isOverBudget ? theme.palette.error.main : theme.palette.text.secondary,
          display: 'block',
          fontWeight: isOverBudget ? 600 : 400,
        }}
      >
        {isOverBudget ? 'Over Budget' : 'Budget Utilized'}
      </Typography>
    </Box>
  );
}

export function BudgetCharts() {
  const theme = useTheme();
  const summary = useLastResolved(summary$);
  if (!summary) return null;

  const remainingBudget = summary.currentBudget - summary.currentExpense;
  const progressPercent = (summary.currentExpense / summary.currentBudget) * 100;
  const endRemainingBudget = summary.endBudget - summary.endExpense;
  const endProgressPercent = (summary.endExpense / summary.endBudget) * 100;
  const timeProgressPercent = summary.elspasedTimeRatio * 100;

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6 }}>
          <Card sx={{ height: '100%', p: 2, boxShadow: theme.shadows[2] }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <CalendarTodayIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Current Period
              </Typography>
              <Typography variant="caption" sx={{ ml: 'auto', color: theme.palette.text.secondary }}>
                {timeProgressPercent.toFixed(1)}% of Year
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: theme.palette.primary.main + '10',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MonetizationOnIcon sx={{ color: theme.palette.primary.main }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Expenses
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      {summary.currentExpense.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      CNY
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: theme.palette.warning.main + '10',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountBalanceWalletIcon sx={{ color: theme.palette.warning.main }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Budget
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                      {summary.currentBudget.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      CNY
                    </Typography>
                    <BudgetProgressBar percent={progressPercent} />
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor:
                        (remainingBudget > 0 ? theme.palette.success.main : theme.palette.error.main) + '10',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShowChartIcon
                      sx={{ color: remainingBudget > 0 ? theme.palette.success.main : theme.palette.error.main }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Balance
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
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                      {remainingBudget > 0 ? 'Under Budget' : 'Over Budget'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Card sx={{ height: '100%', p: 2, boxShadow: theme.shadows[2] }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TimelineIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Year End Projection
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: theme.palette.primary.main + '10',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MonetizationOnIcon sx={{ color: theme.palette.primary.main }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Projected Expenses
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      {summary.endExpense.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      CNY
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: theme.palette.warning.main + '10',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUpIcon sx={{ color: theme.palette.warning.main }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Annual Budget
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                      {summary.endBudget.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      CNY
                    </Typography>
                    <BudgetProgressBar percent={endProgressPercent} />
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor:
                        (endRemainingBudget > 0 ? theme.palette.success.main : theme.palette.error.main) + '10',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShowChartIcon
                      sx={{ color: endRemainingBudget > 0 ? theme.palette.success.main : theme.palette.error.main }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Projected Balance
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: endRemainingBudget > 0 ? theme.palette.success.main : theme.palette.error.main,
                      }}
                    >
                      {Math.abs(endRemainingBudget).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      CNY
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                      {endRemainingBudget > 0 ? 'Under Budget' : 'Over Budget'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: 2,
          p: 3,
        }}
      >
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
      </Box>
    </>
  );
}
