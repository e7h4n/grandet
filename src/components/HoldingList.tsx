import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { holding$ } from '../atoms/portfolio';
import { useLastResolved } from 'ccstate-react';

function HoldingSkeleton() {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <TableRow key={index}>
          <TableCell sx={{ pl: 3 }}>
            <Skeleton variant="text" width={150} height={24} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="text" width={100} height={24} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="text" width={80} height={24} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="text" width={120} height={24} />
          </TableCell>
          <TableCell align="right" sx={{ pr: 3 }}>
            <Skeleton variant="text" width={80} height={24} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function formatCurrency(amount: number, currency: string) {
  const symbols: Record<string, string> = {
    USD: '$',
    CNY: '¥',
  };
  return `${symbols[currency] || ''}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function HoldingList() {
  const holdingData = useLastResolved(holding$);
  if (!holdingData) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          backgroundColor: '#fff',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Holdings
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem', pl: 3 }}>NAME</TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  PRICE
                </TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.875rem', pr: 3 }}>
                  VALUE
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <HoldingSkeleton />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  // 从所有组中提取持仓数据
  const allHoldings = holdingData.groups
    .flatMap((group) => group.holdings)
    .sort((a, b) => Number(b.realtime_market_value[0]) - Number(a.realtime_market_value[0]));

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Holdings
        </Typography>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem', pl: 3 }}>NAME</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                PRICE
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  pr: 3,
                }}
              >
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  VALUE
                  <ArrowDownwardIcon sx={{ fontSize: '1rem', opacity: 0.8 }} />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allHoldings.map((holding) => (
              <TableRow
                key={holding.name}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                  '&:last-child td': { border: 0 },
                }}
              >
                <TableCell sx={{ pl: 3 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>{holding.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Number(holding.position).toLocaleString('en-US')}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography>
                    {formatCurrency(Number(holding.realtime_price[0]), holding.realtime_price[1])}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(Number(holding.average_cost[0]), holding.average_cost[1])}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  <Typography>
                    {formatCurrency(Number(holding.realtime_market_value[0]), holding.realtime_market_value[1])}
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      color: Number(holding.today_price_change_ratio) >= 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {Number(holding.today_price_change_ratio) >= 0 ? (
                      <ArrowDropUpIcon sx={{ fontSize: '1.25rem' }} />
                    ) : (
                      <ArrowDropDownIcon sx={{ fontSize: '1.25rem' }} />
                    )}
                    <Typography variant="body2">
                      {Math.abs(Number(holding.today_price_change_ratio) * 100).toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
