import { http, HttpResponse } from 'msw'
import navIndex from './nav_index.json';
import calendarReturns from './calendar_returns.json';
import cumulativeReturns from './cumulative_returns.json';
import cashFlows from './cash_flows.json';
import investments from './investments.json';
import pnl from './pnl.json';
import irrSummary from './irr_summary.json';

export const handlers = [
    http.get('/Portfolio/nav_index', () => {
        return HttpResponse.json(navIndex)
    }),
    http.get('/Portfolio/calendar_returns', () => {
        return HttpResponse.json(calendarReturns)
    }),
    http.get('/Portfolio/cumulative_returns', () => {
        return HttpResponse.json(cumulativeReturns)
    }),
    http.get('/Portfolio/cash_flows', () => {
        return HttpResponse.json(cashFlows)
    }),
    http.get('/Portfolio/investments', () => {
        return HttpResponse.json(investments)
    }),
    http.get('/Portfolio/pnl', () => {
        return HttpResponse.json(pnl)
    }),
    http.get('/Portfolio/irr_summary', () => {
        return HttpResponse.json(irrSummary)
    }),
]
