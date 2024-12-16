import { http, HttpResponse } from 'msw';
import navIndex from './nav_index.json';
import calendarReturns from './calendar_returns.json';
import cumulativeReturns from './cumulative_returns.json';
import cashFlows from './cash_flows.json';
import investments from './investments.json';
import pnl from './pnl.json';
import irrSummary from './irr_summary.json';
import current from './current.json';
export const handlers = [
  http.get('http://127.0.0.1:5000/portfolio/nav_index', () => {
    return HttpResponse.json(navIndex);
  }),
  http.get('http://127.0.0.1:5000/portfolio/calendar_returns', () => {
    return HttpResponse.json(calendarReturns);
  }),
  http.get('http://127.0.0.1:5000/portfolio/cumulative_returns', () => {
    return HttpResponse.json(cumulativeReturns);
  }),
  http.get('http://127.0.0.1:5000/portfolio/cash_flows', () => {
    return HttpResponse.json(cashFlows);
  }),
  http.get('http://127.0.0.1:5000/portfolio/investments', () => {
    return HttpResponse.json(investments);
  }),
  http.get('http://127.0.0.1:5000/portfolio/pnl', () => {
    return HttpResponse.json(pnl);
  }),
  http.get('http://127.0.0.1:5000/portfolio/irr_summary', () => {
    return HttpResponse.json(irrSummary);
  }),
  http.get('http://127.0.0.1:5000/balance/current', () => {
    return HttpResponse.json(current);
  }),
];
