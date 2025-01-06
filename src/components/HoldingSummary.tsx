import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BalanceIcon from '@mui/icons-material/Balance';

export function HoldingSummary() {
  return (
    <Grid container spacing={3}>
      {/* Total Portfolio Value Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 2,
            backgroundColor: '#fff',
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle1">Total Portfolio Value</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: 'primary.main' }}>
            $124,567.89
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: Today, 15:30 EST
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
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 24, mr: 1, color: 'success.main' }} />
            <Typography variant="subtitle1">Daily Change</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: 'success.main' }}>
            +2.34%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            +$2,845.67
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
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BalanceIcon sx={{ fontSize: 24, mr: 1, color: 'info.main' }} />
            <Typography variant="subtitle1">Rebalancing Deviation</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: 'info.main' }}>
            4.2%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Target allocation deviation
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
} 