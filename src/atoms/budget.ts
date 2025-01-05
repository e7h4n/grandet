import { command, computed, state } from 'ccstate';
import { sessionHeaders$ } from './auth';
import { apiHost$ } from './api';
import * as echarts from 'echarts';

function formatCurrency(value: number, currency: string) {
  const amount = value.toFixed(2);
  const parts = amount.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.') + ' ' + currency;
}

const internalRefresh$ = state(0);

export const refresh$ = command(({ set }) => {
  set(internalRefresh$, (x) => x + 1);
});

function createBudgetSignals(accountPrefix: string) {
  const fetchData$ = computed<Promise<[Date, number][]>>(async (get) => {
    get(internalRefresh$);

    const headers = await get(sessionHeaders$);
    const apiHost = get(apiHost$);
    const url = new URL(apiHost + '/balance/cumulative');
    url.searchParams.set('account_prefix', accountPrefix);
    const resp = await fetch(url.toString(), { headers });
    return (await resp.json()).map((data: [string, string]) => {
      const [dateStr, amountStr] = data;
      return [new Date(dateStr), parseFloat(amountStr)];
    });
  });

  return {
    fetchData$,
  };
}

export function createBudgetSeries(accountPrefix: string, budget: number) {
  const { fetchData$ } = createBudgetSignals(accountPrefix);

  const budgetSeries$ = computed<Promise<[[Date, number], [Date, number]]>>(async (get) => {
    get(internalRefresh$);
    const data = await get(fetchData$);
    const beginDate = data[0][0];
    const endDate = new Date(Date.UTC(beginDate.getFullYear(), 11, 31));
    return [
      [beginDate, 0],
      [endDate, budget],
    ];
  });

  const compareSeries$ = computed(async (get) => {
    const [beginBudget, endBudget] = await get(budgetSeries$);
    const beginTime = beginBudget[0].getTime();
    const endTime = endBudget[0].getTime();
    const budgetSlope = (endBudget[1] - beginBudget[1]) / (endTime - beginTime);

    const data = await get(fetchData$);
    return data.map(([date, actual]) => {
      const daysSinceBegin = date.getTime() - beginTime;
      const expected = budgetSlope * daysSinceBegin;
      return [date, expected - actual];
    });
  });

  return {
    dataSeries$: fetchData$,
    budgetSeries$,
    compareSeries$,
  };
}

export function createBudgetChart(title: string, series: ReturnType<typeof createBudgetSeries>) {
  const { dataSeries$, budgetSeries$, compareSeries$ } = series;

  const renderChart$ = command(async ({ get }, el: HTMLDivElement, signal: AbortSignal) => {
    const data = await get(dataSeries$);
    const compareData = await get(compareSeries$);
    const budgetSeries = await get(budgetSeries$);
    signal.throwIfAborted();

    const chart = echarts.init(el);

    signal.addEventListener('abort', () => {
      chart.dispose();
    });

    chart.setOption({
      xAxis: {
        type: 'time',
        min: budgetSeries[0][0],
        max: budgetSeries[1][0],
      },
      yAxis: [
        {},
        {
          splitLine: {
            show: false,
          },
          scale: true,
          max: (value: { max: number; min: number }) => {
            return Math.max(Math.abs(value.max), Math.abs(value.min));
          },
          min: (value: { min: number; max: number }) => {
            return -Math.max(Math.abs(value.max), Math.abs(value.min));
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params: { data: [Date, number] }[]) => {
          const slope = budgetSeries[1][1] / (budgetSeries[1][0].getTime() - budgetSeries[0][0].getTime());
          const elapsedTime = params[0].data[0].getTime() - budgetSeries[0][0].getTime();
          const expected = slope * elapsedTime;

          return (
            params[0].data[0].toISOString().slice(0, 10) +
            '<br>Current Period Total: ' +
            formatCurrency(params[0].data[1], 'CNY') +
            '<br>Compare Period Total: ' +
            formatCurrency(expected, 'CNY') +
            '<br>Diff: ' +
            formatCurrency(params.length >= 2 ? params[1].data[1] : 0, 'CNY')
          );
        },
      },
      series: [
        {
          type: 'line',
          step: 'start',
          data: data,
          yAxisIndex: 0,
          showSymbol: false,
          markLine: {
            data: [
              {
                xAxis: new Date(),
              },
            ],
            symbol: 'none',
            label: {
              show: false,
            },
            lineStyle: {
              color: '#CCC',
            },
            animation: false,
            silent: true,
          },
        },
        {
          type: 'bar',
          areaStyle: {},
          yAxisIndex: 1,
          data: compareData,
          itemStyle: {
            color: (params: { value: [Date, number] }) => {
              return params.value[1] > 0 ? '#3daf46' : '#af3d3d';
            },
          },
        },
        {
          type: 'line',
          yAxisIndex: 0,
          data: budgetSeries,
          symbol: 'none',
          animation: false,
          silent: true,
        },
      ],
      grid: {
        top: 20,
      },
    });

    window.addEventListener(
      'resize',
      () => {
        chart.resize();
      },
      { signal },
    );
  });

  const chartMeta$ = computed(async (get) => {
    const data = await get(dataSeries$);
    const now = new Date();
    let latestData = data[0];

    for (const item of data) {
      if (item[0] <= now && item[0] >= latestData[0]) {
        latestData = item;
      } else {
        break;
      }
    }

    const budgetSeries = await get(budgetSeries$);
    const slope = budgetSeries[1][1] / (budgetSeries[1][0].getTime() - budgetSeries[0][0].getTime());
    const expected = slope * (latestData[0].getTime() - budgetSeries[0][0].getTime());

    return {
      title,
      latestDate: latestData[0],
      latestValue: latestData[1],
      expected,
      diff: expected - latestData[1],
    };
  });

  return {
    renderChart$,
    chartMeta$,
    series,
  };
}

export const budgetCharts = [
  createBudgetChart('Living', createBudgetSeries('Expenses:Living:', 400000)),
  createBudgetChart('Outing', createBudgetSeries('Expenses:Outing', 400000)),
  createBudgetChart('Education', createBudgetSeries('Expenses:Education', 400000)),
  createBudgetChart('Consume', createBudgetSeries('Expenses:Consume:', 80000)),
  createBudgetChart('Social', createBudgetSeries('Expenses:Social', 50000)),
];
