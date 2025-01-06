import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { holding$ } from '../atoms/portfolio';
import { useLastResolved } from 'ccstate-react';

const pieChartColors = ['#1976d2', '#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

export function HoldingDistribution() {
  const holdingData = useLastResolved(holding$);
  if (!holdingData) return null;

  const totalValue = Number(holdingData.realtime_market_value[0]);

  // 计算每个组的分配数据
  const allocations = holdingData.groups
    .filter(
      (group) =>
        // 过滤掉现金等价物组（通常包含 USD、CNY 等）
        !group.holdings.every((h) => ['USD', 'CNY'].includes(h.name)),
    )
    .map((group) => {
      const actualRatio = Number(group.realtime_market_value[0]) / totalValue;
      const targetRatio = Number(group.target_ratio);
      // 计算偏离度：实际比例相对于目标比例的偏离程度
      // 如果实际比例等于目标比例，deviation 为 0
      // 如果实际比例大于目标比例，deviation 为正数
      // 如果实际比例小于目标比例，deviation 为负数
      const deviation = (actualRatio - targetRatio) / targetRatio;

      // 将偏离度映射到进度条的值
      // deviation 为 0 时，progressValue 为 50
      // deviation 为 1 (100% 偏离) 时，progressValue 为 100
      // deviation 为 -1 (-100% 偏离) 时，progressValue 为 0
      const progressValue = 50 * (1 + deviation);

      return {
        name: group.name,
        value: actualRatio * 100,
        amount: Number(group.realtime_market_value[0]),
        dailyChangePercent: Number(group.today_market_value_change_ratio) * 100,
        targetRatio: targetRatio * 100,
        deviation,
        progressValue: Math.max(0, Math.min(100, progressValue)), // 确保值在 0-100 之间
      };
    });

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
                data: allocations.map((item, index) => ({
                  id: index,
                  value: item.value,
                  label: `${item.name}\n${item.value.toFixed(1)}%`,
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
        {allocations.map((item, index) => (
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
                      Target: {item.targetRatio.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 500 }}>Current: {item.value.toFixed(1)}%</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        Math.abs(item.deviation) < 0.05
                          ? 'text.secondary'
                          : item.deviation > 0
                            ? 'error.main'
                            : 'warning.main',
                    }}
                  >
                    Deviation: {item.deviation >= 0 ? '+' : ''}
                    {(item.deviation * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ position: 'relative' }}>
                {/* 中间线，表示目标位置 */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 1,
                  }}
                />
                <LinearProgress
                  variant="determinate"
                  value={item.progressValue}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: pieChartColors[index],
                      transition: 'none',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
