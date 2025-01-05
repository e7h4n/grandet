import { expect, test, vi } from 'vitest';
import { createBudgetChart, createBudgetSeries } from '../budget';
import { createStore } from 'ccstate';

test('cumulative', async () => {
  const { dataSeries$, budgetSeries$, compareSeries$ } = createBudgetSeries('Expenses:Living:', 100000);

  const store = createStore();

  const data = await store.get(dataSeries$);
  const compare = await store.get(compareSeries$);
  const budget = await store.get(budgetSeries$);

  expect(data[0][0]).toEqual(budget[0][0]);
  expect(budget[1][0].getDate()).toBe(31);
  expect(budget[1][0].getMonth()).toBe(11);
  expect(budget[1][1]).toBe(100000);

  expect(compare.length).toBe(data.length);
  expect(compare[compare.length - 1][1]).not.toEqual(data[data.length - 1][1]);
});

test('chart title', async () => {
  const { chartMeta$ } = createBudgetChart('Living', createBudgetSeries('Expenses:Living:', 400000));

  vi.setSystemTime(new Date('2025-08-01'));

  const store = createStore();
  const { latestDate, latestValue, expected, diff, title } = await store.get(chartMeta$);

  expect(latestDate.toISOString().slice(0, 10)).toBe('2025-08-01');
  expect(latestValue).toBe(46000);
  expect(expected).toBe(232967.03296703295);
  expect(diff).toBe(186967.03296703295);
  expect(title).toBe('Living');
});
