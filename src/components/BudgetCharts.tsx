import { useSet } from 'ccstate-react';
import { budgetCharts, createBudgetChart } from '../atoms/budget';
import { HTMLAttributes, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid2';

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
          <Grid size={{ xs: 12, md: 6 }} key={idx}>
            <BudgetChart chart={chart} style={{ height: '300px' }}></BudgetChart>
          </Grid>
        );
      })}
    </Grid>
  );
}
