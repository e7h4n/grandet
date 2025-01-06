import { Box, Paper, Skeleton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BalanceIcon from '@mui/icons-material/Balance';
import { useLastResolved } from 'ccstate-react';
import { holding$ } from '../atoms/portfolio';

function SummarySkeleton() {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper elevation={0} sx={{ borderRadius: 2, backgroundColor: '#fff', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
          <Skeleton width={140} height={20} />
        </Box>
        <Skeleton variant="rectangular" width={200} height={40} sx={{ mb: 1 }} />
        <Skeleton width={160} height={16} />
      </Paper>
    </Grid>
  );
}

export function HoldingSummary() {
  const holdingData = useLastResolved(holding$);
  if (!holdingData) {
    return (
      <Grid container spacing={3}>
        <SummarySkeleton />
        <SummarySkeleton />
        <SummarySkeleton />
      </Grid>
    );
  }

  // Calculate max rebalancing deviation
  const maxDeviation = Math.max(
    ...holdingData.groups.map((group) => Math.abs(group.realtime_ratio - group.target_ratio)),
  );

  // Format currency value
  const formatCurrency = (amount: [string, string]) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: amount[1],
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount[0]));
  };

  // Format percentage
  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return (numValue * 100).toFixed(2) + '%';
  };

  const todayChangeRatio = parseFloat(holdingData.today_market_value_change_ratio);
  const changeColor = todayChangeRatio >= 0 ? 'success.main' : 'error.main';

  return (
    <Grid container spacing={3}>
      {/* Total Portfolio Value Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            backgroundColor: '#fff',
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle1">Total Portfolio Value</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: 'primary.main' }}>
            {formatCurrency(holdingData.realtime_market_value)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
        </Paper>
      </Grid>

      {/* Daily Change Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            backgroundColor: '#fff',
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 24, mr: 1, color: changeColor }} />
            <Typography variant="subtitle1">Daily Change</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: changeColor }}>
            {formatPercentage(holdingData.today_market_value_change_ratio)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatCurrency(holdingData.today_market_value_change)}
          </Typography>
        </Paper>
      </Grid>

      {/* Rebalancing Deviation Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            backgroundColor: '#fff',
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BalanceIcon sx={{ fontSize: 24, mr: 1, color: 'info.main' }} />
            <Typography variant="subtitle1">Rebalancing Deviation</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: 'info.main' }}>
            {formatPercentage(maxDeviation)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Maximum target allocation deviation
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
