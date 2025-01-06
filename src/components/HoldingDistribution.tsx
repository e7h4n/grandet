import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

interface AllocationItem {
  name: string;
  value: number;
  amount: number;
  dailyChangePercent: number;
}

const mockAllocations: AllocationItem[] = [
  { name: 'US Stocks', value: 50.0, amount: 250000, dailyChangePercent: 1.2 },
  { name: 'International Stocks', value: 30.0, amount: 150000, dailyChangePercent: -0.8 },
  { name: 'Bonds', value: 20.0, amount: 100000, dailyChangePercent: 0.5 },
];

const pieChartColors = ['#1976d2', '#2196f3', '#4caf50'];

export function HoldingDistribution() {
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
          Portfolio Allocation
        </Typography>
      </Box>

      {/* Ring Chart */}
      <Box
        sx={{
          px: 2,
          display: 'flex',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Box sx={{ width: 300, py: 1 }}>
          <PieChart
            series={[
              {
                data: mockAllocations.map((item, index) => ({
                  id: index,
                  value: item.value,
                  label: `${item.name}\n${item.value}%`,
                  color: pieChartColors[index],
                })),
                innerRadius: 80,
                outerRadius: 120,
                paddingAngle: 2,
                cornerRadius: 4,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 80, additionalRadius: -20, color: 'gray' },
              },
            ]}
            height={300}
            width={300}
            margin={{ left: 0, right: 0 }}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 0,
                hidden: true,
              },
            }}
          />
        </Box>
      </Box>

      {/* Allocation List */}
      <Box>
        {mockAllocations.map((item, index) => (
          <Box
            key={item.name}
            sx={{
              px: 2,
              '&:not(:last-child)': {
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              },
            }}
          >
            <Box sx={{ py: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: pieChartColors[index],
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Allocation: {item.value.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 500 }}>${item.amount.toLocaleString('en-US')}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: item.dailyChangePercent >= 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {item.dailyChangePercent >= 0 ? '+' : ''}
                    {item.dailyChangePercent.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.value}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: pieChartColors[index],
                  },
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
