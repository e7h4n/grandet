import { createStore } from 'ccstate';
import { expect, it } from 'vitest';
import { navCalendarReturns$, navIndex$ } from '../portfolio';

it('get nav_index', async () => {
  const store = createStore();

  const index = await store.get(navIndex$);

  expect(index).toHaveLength(1232);
});

it('get nav_calendar_returns', async () => {
  const store = createStore();

  const returns = await store.get(navCalendarReturns$);

  expect(returns).toMatchInlineSnapshot(`
    [
      [
        2021-12-30T16:00:00.000Z,
        -0.03950478352276632,
      ],
      [
        2022-12-30T16:00:00.000Z,
        -0.1405306787111109,
      ],
      [
        2023-12-30T16:00:00.000Z,
        0.2748820750554668,
      ],
      [
        2024-12-30T16:00:00.000Z,
        0.23665138484556714,
      ],
    ]
  `);
});
