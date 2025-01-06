import { Box, Paper, Typography, LinearProgress, Skeleton, Stack, Divider } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { holding$ } from '../atoms/portfolio';
import { useLastResolved } from 'ccstate-react';
import Grid from '@mui/material/Grid2';
import CircleIcon from '@mui/icons-material/Circle';

const pieChartColors = ['#1976d2', '#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

function HoldingDistributionSkeleton() {
  return (
    <Stack>
      {/* 饼图骨架屏 */}
      <Grid container justifyContent="center">
        <Grid size={{ xs: 12 }} container justifyContent="center">
          <Skeleton variant="circular" width={240} height={240} />
        </Grid>
      </Grid>
      <Divider />

      {/* 分配列表骨架屏 - 两列布局 */}
      <Grid container>
        {[1, 2, 3, 4].map((index) => (
          <Grid
            key={index}
            size={{ xs: 6 }}
            p={2}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '&:nth-of-type(odd)': {
                borderRight: 1,
                borderColor: 'divider',
              },
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton variant="circular" width={12} height={12} />
                  <Stack>
                    <Skeleton variant="text" width={80} height={24} />
                    <Skeleton variant="text" width={60} height={16} />
                  </Stack>
                </Stack>
                <Stack alignItems="flex-end">
                  <Skeleton variant="text" width={70} height={24} />
                  <Skeleton variant="text" width={90} height={16} />
                </Stack>
              </Stack>
              <Skeleton variant="rounded" width="100%" height={8} />
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

interface Allocation {
  name: string;
  value: number;
  amount: number;
  dailyChangePercent: number;
  targetRatio: number;
  deviation: number;
  progressValue: number;
}

function AllocationItem({ item, color }: { item: Allocation; color: string }) {
  return (
    <Stack spacing={1.5}>
      {/* 标题行 */}
      <Stack direction="row" spacing={1} alignItems="center" width="100%">
        <CircleIcon sx={{ fontSize: 12, color, flexShrink: 0 }} />
        <Typography
          variant="subtitle2"
          fontWeight={500}
          noWrap
          title={item.name}
          sx={{
            flexGrow: 1,
            fontSize: '0.875rem',
          }}
        >
          {item.name}
        </Typography>
      </Stack>

      {/* 数据行 */}
      <Grid container spacing={1}>
        <Grid size={{ xs: 6 }}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              Current
            </Typography>
            <Typography variant="subtitle2">{item.value.toFixed(1)}%</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              Target
            </Typography>
            <Typography variant="subtitle2">{item.targetRatio.toFixed(1)}%</Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* 偏差值 */}
      <Typography
        variant="caption"
        color={Math.abs(item.deviation) < 0.05 ? 'text.secondary' : item.deviation > 0 ? 'error.main' : 'warning.main'}
      >
        Deviation: {item.deviation >= 0 ? '+' : ''}
        {(item.deviation * 100).toFixed(1)}%
      </Typography>

      {/* 进度条 */}
      <Box position="relative">
        <LinearProgress
          variant="determinate"
          value={item.value}
          sx={{
            height: 6,
            borderRadius: 1,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              bgcolor: color,
              transition: 'none',
            },
          }}
        />
      </Box>
    </Stack>
  );
}

export function HoldingDistribution() {
  const holdingData = useLastResolved(holding$);
  if (!holdingData) {
    return (
      <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
        <Stack>
          <Box p={2}>
            <Typography variant="h6" fontWeight={500}>
              Portfolio Allocation
            </Typography>
          </Box>
          <Divider />
          <HoldingDistributionSkeleton />
        </Stack>
      </Paper>
    );
  }

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
    <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
      <Stack>
        <Box p={2}>
          <Typography variant="h6" fontWeight={500}>
            Portfolio Allocation
          </Typography>
        </Box>
        <Divider />

        {/* Ring Chart */}
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12 }} container justifyContent="center">
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
          </Grid>
        </Grid>
        <Divider />

        {/* Allocation List - 两列布局 */}
        <Grid container>
          {allocations.map((item, index) => (
            <Grid
              key={item.name}
              size={{ xs: 6 }}
              p={2}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '&:nth-of-type(odd)': {
                  borderRight: 1,
                  borderColor: 'divider',
                },
              }}
            >
              <AllocationItem item={item} color={pieChartColors[index]} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
}
