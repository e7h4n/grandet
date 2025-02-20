import { computed, command, state } from 'ccstate';
import * as echarts from 'echarts';
import { sessionHeaders$ } from './auth';
import { apiHost$ } from './api';

const internalRefresh$ = state(0);

export const refresh$ = command(({ set }) => {
  set(internalRefresh$, (x) => x + 1);
});

export const navIndex$ = computed(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  const resp = await fetch(apiHost + '/portfolio/nav_index' + window.location.search, { headers });
  const data = await resp.json();
  return data.map(([dateStr, indexStr]: [string, string]) => {
    return [new Date(dateStr), parseFloat(indexStr)];
  });
});

export const cashFlows = computed<
  Promise<
    {
      account: string;
      amount: {
        currency: string;
        number: number;
      };
      date: Date;
      isDividend: boolean;
      source: string;
    }[]
  >
>(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  const resp = await fetch(apiHost + '/portfolio/cash_flows' + window.location.search, { headers });
  const data = await resp.json();
  return data.map(
    ([dateStr, [amountStr, currency], isDividend, source, account]: [
      string,
      [string, string],
      boolean,
      string,
      string,
    ]) => {
      const amount = parseFloat(amountStr);
      return {
        date: new Date(dateStr),
        amount: {
          number: amount,
          currency,
        },
        isDividend,
        source,
        account,
      };
    },
  );
});

export const investments$ = computed(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  const resp = (await fetch(apiHost + '/portfolio/investments' + window.location.search, {
    headers,
  }).then((res) => res.json())) as {
    profitable: { name: string; pnl: string; currency: string }[];
    unprofitable: { name: string; pnl: string; currency: string }[];
  };

  return {
    profitable: resp.profitable.map((i) => ({
      ...i,
      pnl: parseFloat(i.pnl),
      currency: i.currency,
    })),
    unprofitable: resp.unprofitable.map((i) => ({
      ...i,
      pnl: parseFloat(i.pnl),
      currency: i.currency,
    })),
  };
});

export const pnl$ = computed(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  const resp = await fetch(apiHost + '/portfolio/pnl' + window.location.search, { headers });
  const data = await resp.json();
  return {
    currency: data.currency,
    dividendExTax: parseFloat(data.dividend_ex_tax),
    dividendTax: parseFloat(data.dividend_tax),
    fee: parseFloat(data.fee),
    realizedPnlExFee: parseFloat(data.realized_pnl_ex_fee),
    unrealizedPnl: parseFloat(data.unrealized_pnl),
  };
});

export const calendarReturns$ = computed<Promise<[Date, number][][]>>(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  const resp = await fetch(apiHost + '/portfolio/calendar_returns' + window.location.search, { headers });
  const data = await resp.json();
  return data.map((data: [string, number][]) => {
    return data.map(([dateStr, value]) => [new Date(dateStr), value]);
  });
});

export const cumulativeReturns$ = computed(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  return fetch(apiHost + '/portfolio/cumulative_returns' + window.location.search, { headers }).then((res) =>
    res.json(),
  );
});

export const irrSummary$ = computed(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  return fetch(apiHost + '/portfolio/irr_summary' + window.location.search, {
    headers,
  }).then((res) => res.json());
});

export const shortAssets$ = computed(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  return fetch(apiHost + '/balance/short_assets' + window.location.search, { headers })
    .then((res) => res.json())
    .then((data) => {
      return data.map((d: [string, string]) => {
        const dateStr = d[0];
        const numberStr = d[1];
        return [new Date(dateStr), parseFloat(numberStr)];
      });
    });
});

export const navIndexChartOptions$ = computed(async (get) => {
  const data = await get(navIndex$);

  return {
    backgroundColor: '#fff',
    textStyle: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee',
          type: 'dashed',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee',
          type: 'dashed',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        formatter: function (params: number) {
          return params.toFixed(2);
        },
      },
      min: 'dataMin',
      max: 'dataMax',
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ccc',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#333',
        fontSize: 13,
      },
      formatter: function (params: { data: number[] }[]) {
        const date = new Date(params[0].data[0]);
        const value = params[0].data[1].toFixed(2);
        return `${date.toLocaleDateString()}<br/>NAV: ${value}`;
      },
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: data,
        lineStyle: {
          width: 2,
          color: '#2196f3',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(33, 150, 243, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(33, 150, 243, 0)',
              },
            ],
          },
        },
      },
      {
        type: 'line',
        markLine: {
          symbol: 'none',
          lineStyle: {
            color: '#999',
            type: 'dashed',
          },
          data: [
            {
              yAxis: 1.0,
              label: {
                show: false,
              },
            },
          ],
        },
        data: [],
      },
    ],
    grid: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 5,
      containLabel: true,
    },
    animation: false,
  };
});

export const calendarReturnsChartOptions$ = computed(async (get) => {
  const mwrData = await get(calendarReturns$);
  const navData = await get(navCalendarReturns$);

  // Convert data to [year, value] format
  const mwrYearData = mwrData[0].map(([date, value]) => {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() - 1);
    return [adjustedDate.getFullYear(), value];
  });
  const navYearData = navData.map(([date, value]) => {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() - 1);
    return [adjustedDate.getFullYear(), value];
  });

  return {
    backgroundColor: '#fff',
    textStyle: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    legend: {
      data: ['MWR', 'NAV'],
      top: 0,
      right: 0,
      textStyle: {
        color: '#666',
        fontSize: 12,
      },
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        fontSize: 12,
        color: '#666',
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (params: number) {
          return (params * 100).toFixed(1) + '%';
        },
        fontSize: 12,
        color: '#666',
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee',
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#ccc',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#333',
        fontSize: 13,
      },
      formatter: function (params: { seriesName: string; data: [number, number] }[]) {
        return `<div style="padding: 3px;">
          <div style="font-size: 14px;font-weight:500;margin-bottom:4px">${params[0].data[0]}</div>
          ${params.map((param) => `<div style="font-size: 13px;">${param.seriesName}: ${(param.data[1] * 100).toFixed(1)}%</div>`).join('')}
        </div>`;
      },
    },
    series: [
      {
        name: 'MWR',
        type: 'bar',
        data: mwrYearData,
        barWidth: '30%',
        barGap: '10%',
        itemStyle: {
          color: '#55b66d',
        },
        label: {
          show: true,
          position: 'top',
          color: '#666',
          fontSize: 12,
          formatter: (params: { data: number[] }) => {
            return (params.data[1] * 100).toFixed(1) + '%';
          },
        },
      },
      {
        name: 'NAV',
        type: 'bar',
        data: navYearData,
        barWidth: '30%',
        barGap: '10%',
        itemStyle: {
          color: '#2196f3',
        },
        label: {
          show: true,
          position: 'top',
          color: '#666',
          fontSize: 12,
          formatter: (params: { data: number[] }) => {
            return (params.data[1] * 100).toFixed(1) + '%';
          },
        },
      },
    ],
    grid: {
      left: 0,
      right: 0,
      top: 30,
      bottom: 5,
      containLabel: true,
    },
    animation: false,
  };
});

const navChart$ = state<echarts.ECharts | undefined>(undefined);

export const reloadNavChart$ = command(async ({ get }, signal?: AbortSignal) => {
  const options = await get(navIndexChartOptions$);
  signal?.throwIfAborted();

  get(navChart$)?.setOption(options);
});

export const renderNavIndex$ = command(async ({ get, set }, elem: HTMLDivElement, signal: AbortSignal) => {
  const options = await get(navIndexChartOptions$);
  const chart = echarts.init(elem);
  set(navChart$, chart);
  signal.addEventListener('abort', () => {
    set(navChart$, undefined);
    chart.dispose();
  });
  window.addEventListener(
    'resize',
    () => {
      chart.resize();
    },
    { signal },
  );
  chart.setOption(options);
});

const calendarChart$ = state<echarts.ECharts | undefined>(undefined);

export const reloadCalendarChart$ = command(async ({ get }, signal?: AbortSignal) => {
  const options = await get(calendarReturnsChartOptions$);
  signal?.throwIfAborted();

  get(calendarChart$)?.setOption(options);
});

export const renderCalendarReturns$ = command(async ({ get, set }, elem: HTMLDivElement, signal: AbortSignal) => {
  const options = await get(calendarReturnsChartOptions$);
  const chart = echarts.init(elem);
  set(calendarChart$, chart);
  signal.addEventListener('abort', () => {
    set(calendarChart$, undefined);
    chart.dispose();
  });
  window.addEventListener(
    'resize',
    () => {
      chart.resize();
    },
    { signal },
  );
  chart.setOption(options);
});

export type Currency = 'USD' | 'CNY';
export type Amount = [string, Currency];

export interface Position {
  average_cost: Amount;
  last_market_value: Amount;
  last_price: Amount;
  last_price_change: Amount | [];
  last_price_change_ratio: string;
  name: string;
  position: string;
  realtime_market_value: Amount;
  realtime_price: string | Amount;
  realtime_price_change: Amount | [];
  realtime_price_change_ratio: string;
  realtime_ratio: number;
  today_price_change: Amount | [];
  today_price_change_ratio: string;
  unrealized_pnl: Amount | [];
  unrealized_pnl_ratio: string;
}

export interface Group {
  holdings: Position[];
  last_market_value: Amount;
  name: string;
  realtime_market_value: Amount;
  realtime_ratio: number;
  target_diff: Amount;
  target_ratio: number;
  today_market_value_change: Amount;
  today_market_value_change_ratio: string;
  unrealized_pnl: Amount;
  unrealized_pnl_ratio: string;
}

export interface HoldingData {
  groups: Group[];
  index: number;
  last_market_value: Amount;
  realtime_market_value: Amount;
  today_market_value_change: Amount;
  today_market_value_change_ratio: string;
  unrealized_pnl: Amount;
}

export const holding$ = computed<Promise<HoldingData>>(async (get) => {
  get(internalRefresh$);

  const headers = await get(sessionHeaders$);
  const apiHost = get(apiHost$);
  return fetch(apiHost + '/portfolio/holding', { headers }).then((res) => res.json());
});

export const navCalendarReturns$ = computed(async (get) => {
  const nav_index = await get(navIndex$);

  // Group data by year
  const yearData: Map<number, [Date, number][]> = new Map();
  nav_index.forEach(([date, value]: [Date, number]) => {
    const year = date.getFullYear();
    if (!yearData.has(year)) {
      yearData.set(year, []);
    }
    yearData.get(year)!.push([date, value]);
  });

  // Calculate annual returns
  const returns: [Date, number][] = [];
  yearData.forEach((data, year) => {
    data.sort((a, b) => a[0].getTime() - b[0].getTime());
    const startValue = data[0][1];
    const endValue = data[data.length - 1][1];
    const rawReturn = endValue / startValue - 1;
    const returnDate = new Date(year, 11, 31);
    returns.push([returnDate, rawReturn]);
  });

  return returns.sort((a, b) => a[0].getTime() - b[0].getTime());
});
