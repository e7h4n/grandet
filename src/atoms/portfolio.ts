import { $computed, $effect } from 'rippling';
import * as echarts from 'echarts';
import { sessionHeadersAtom } from './auth';
import { apiHostAtom } from './api';

export const navIndex = $computed(async (get) => {
  const headers = await get(sessionHeadersAtom);
  const apiHost = get(apiHostAtom);
  const resp = await fetch(apiHost + '/portfolio/nav_index' + window.location.search, { headers });
  const data = await resp.json();
  return data.map(([dateStr, indexStr]: [string, string]) => {
    return [new Date(dateStr), parseFloat(indexStr)];
  });
});

export const cashFlows = $computed<
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
  const headers = await get(sessionHeadersAtom);
  const apiHost = get(apiHostAtom);
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

export const investments = $computed(async (get) => {
  const headers = await get(sessionHeadersAtom);
  const apiHost = get(apiHostAtom);
  return fetch(apiHost + '/portfolio/investments' + window.location.search, {
    headers,
  }).then((res) => res.json());
});

export const pnl = $computed(async (get) => {
  const headers = await get(sessionHeadersAtom);
  const apiHost = get(apiHostAtom);
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

export const calendarReturns = $computed(async (get) => {
  const headers = await get(sessionHeadersAtom);
  const apiHost = get(apiHostAtom);
  const resp = await fetch(apiHost + '/portfolio/calendar_returns' + window.location.search, { headers });
  const data = await resp.json();
  return data.map((data: [string, number][]) => {
    return data.map(([dateStr, value]) => [new Date(dateStr), value]);
  });
});

export const cumulativeReturns = $computed(async (get) => {
  const headers = await get(sessionHeadersAtom);
  const apiHost = get(apiHostAtom);
  return fetch(apiHost + '/portfolio/cumulative_returns' + window.location.search, { headers }).then((res) =>
    res.json(),
  );
});

export const irrSummary = $computed(async (get) => {
  const headers = await get(sessionHeadersAtom);
  const apiHost = get(apiHostAtom);
  return fetch(apiHost + '/portfolio/irr_summary' + window.location.search, {
    headers,
  }).then((res) => res.json());
});

export const navIndexChartOptions = $computed(async (get) => {
  const data = await get(navIndex);

  return {
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (params: number) {
          return params.toFixed(2);
        },
      },
      min: 'dataMin',
      max: 'dataMax',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: { data: number[] }[]) {
        return params[0].data[0] + '<br>' + params[0].data[1].toFixed(2);
      },
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: data,
      },
    ],
    grid: {
      x: 60,
      y: 20,
      x2: 20,
      y2: 60,
    },
  };
});

export const calendarReturnsChartOptions = $computed(async (get) => {
  const data = await get(calendarReturns);
  return {
    xAxis: {
      type: 'category',
      axisLabel: {
        formatter: (value: string) => {
          return new Date(Date.parse(value) - 86400000).getFullYear();
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (params: number) {
          return (params * 100).toFixed(1) + '%';
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: { data: [Date, number] }[]) {
        const d = new Date(params[0].data[0].getTime() - 24 * 60 * 60 * 1000);
        return d.getFullYear() + '<br>' + (params[0].data[1] * 100).toFixed(1) + '%';
      },
    },
    series: [
      {
        type: 'bar',
        data: data[0],
        itemStyle: {
          color: (params: { value: number[] }) => {
            return params.value[1] > 0 ? '#3daf46' : '#af3d3d';
          },
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: { data: number[] }) => {
            return (params.data[1] * 100).toFixed(1) + '%';
          },
        },
      },
    ],
    grid: {
      x: 60,
      y: 20,
      x2: 20,
      y2: 60,
    },
  };
});

export const renderNavIndex = $effect(async (get, _set, elem: HTMLDivElement, signal: AbortSignal) => {
  const options = await get(navIndexChartOptions);
  const chart = echarts.init(elem);
  signal.addEventListener('abort', () => {
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

export const renderCalendarReturns = $effect(async (get, _set, elem: HTMLDivElement, signal: AbortSignal) => {
  const options = await get(calendarReturnsChartOptions);
  const chart = echarts.init(elem);
  signal.addEventListener('abort', () => {
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
