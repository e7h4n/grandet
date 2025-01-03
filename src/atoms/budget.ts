import { command, computed, state } from 'ccstate';
import { sessionHeaders$ } from './auth';
import { apiHost$ } from './api';

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

function createBudgetChart(title: string, accountPrefix: string, budget: number) {
  const { fetchData$ } = createBudgetSignals(accountPrefix);

  const chart$ = computed(() => {
    return {
      title,
    };
  });

  const budgetSeries$ = computed<[[Date, number], [Date, number]]>((get) => {
    get(internalRefresh$);
    const now = new Date();
    const beginDate = new Date(now.getFullYear(), 0, 1);
    const endDate = new Date(now.getFullYear(), 11, 31);
    return [
      [beginDate, 0],
      [endDate, budget],
    ];
  });

  const compareSeries$ = computed(async (get) => {
    const data = await get(fetchData$);
    const [beginBudget, endBudget] = get(budgetSeries$);
    const budgetSlope =
      Number(endBudget[1] - beginBudget[1]) /
      ((endBudget[0] as Date).getTime() - (beginBudget[0] as Date).getTime()) /
      (1000 * 60 * 60 * 24);
    const beginTime = beginBudget[0].getTime();

    return data.map(([date, actual]) => {
      const daysSinceBegin = (date.getTime() - beginTime) / (1000 * 60 * 60 * 24);
      const expected = budgetSlope * daysSinceBegin;
      return [date, actual - expected];
    });
  });

  return {
    chart$,
    data$: fetchData$,
    compare$: compareSeries$,
    budget$: budgetSeries$,
  };
}

export const budgetCharts = [
  createBudgetChart('Living', 'Expenses:Living:', 400000),
  createBudgetChart('Outing', 'Expenses:Outing', 400000),
  createBudgetChart('Education', 'Expenses:Education', 400000),
  createBudgetChart('Consume', 'Expenses:Consume:', 80000),
  createBudgetChart('Social', 'Expenses:Social', 50000),
];
