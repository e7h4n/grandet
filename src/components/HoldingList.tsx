import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface HoldingItem {
  name: string;
  type: 'stock' | 'fund';
  price: number;
  quantity: number;
  value: number;
  dailyChangePercent: number;
}

const mockHoldings: HoldingItem[] = [
  { name: 'Apple Inc.', type: 'stock', price: 175.50, quantity: 100, value: 17550, dailyChangePercent: 1.20 },
  { name: 'Vanguard S&P 500 ETF', type: 'fund', price: 420.30, quantity: 200, value: 84060, dailyChangePercent: -0.80 },
  { name: 'Microsoft Corp.', type: 'stock', price: 338.45, quantity: 75, value: 25383.75, dailyChangePercent: 0.95 },
  { name: 'iShares MSCI EAFE ETF', type: 'fund', price: 75.20, quantity: 300, value: 22560, dailyChangePercent: -1.20 },
  { name: 'Tesla Inc.', type: 'stock', price: 248.50, quantity: 50, value: 12425, dailyChangePercent: 2.30 },
  { name: 'Vanguard Total Bond ETF', type: 'fund', price: 72.40, quantity: 400, value: 28960, dailyChangePercent: 0.15 },
  { name: 'Amazon.com Inc.', type: 'stock', price: 145.20, quantity: 120, value: 17424, dailyChangePercent: 1.75 }
];

export function HoldingList() {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <Box sx={{ 
        p: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>Holdings</Typography>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem', pl: 3 }}>NAME</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>CURRENT PRICE</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>QUANTITY</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>VALUE</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.875rem', pr: 3 }}>DAILY CHANGE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockHoldings.map((holding) => (
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
                    <Typography variant="caption" color="text.secondary">
                      {holding.type}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${holding.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">{holding.quantity}</TableCell>
                <TableCell align="right">
                  ${holding.value.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    color: holding.dailyChangePercent >= 0 ? 'success.main' : 'error.main',
                  }}>
                    {holding.dailyChangePercent >= 0 ? 
                      <ArrowDropUpIcon sx={{ fontSize: '1.5rem' }} /> : 
                      <ArrowDropDownIcon sx={{ fontSize: '1.5rem' }} />
                    }
                    {Math.abs(holding.dailyChangePercent).toFixed(2)}%
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