import { http, HttpResponse } from 'msw';
import navIndex from './nav_index.json';
import calendarReturns from './calendar_returns.json';
import cumulativeReturns from './cumulative_returns.json';
import cashFlows from './cash_flows.json';
import investments from './investments.json';
import pnl from './pnl.json';
import irrSummary from './irr_summary.json';
import current from './current.json';
import cumulative from './cumulative.json';
import holding from './holding.json';
import short_assets from './short.json';

export const handlers = [
  http.get('https://bean.elmz.life/portfolio/nav_index', () => {
    return HttpResponse.json(navIndex);
  }),
  http.get('https://bean.elmz.life/portfolio/calendar_returns', () => {
    return HttpResponse.json(calendarReturns);
  }),
  http.get('https://bean.elmz.life/portfolio/cumulative_returns', () => {
    return HttpResponse.json(cumulativeReturns);
  }),
  http.get('https://bean.elmz.life/portfolio/cash_flows', () => {
    return HttpResponse.json(cashFlows);
  }),
  http.get('https://bean.elmz.life/portfolio/investments', () => {
    return HttpResponse.json(investments);
  }),
  http.get('https://bean.elmz.life/portfolio/pnl', () => {
    return HttpResponse.json(pnl);
  }),
  http.get('https://bean.elmz.life/portfolio/irr_summary', () => {
    return HttpResponse.json(irrSummary);
  }),
  http.get('https://bean.elmz.life/balance/current', () => {
    return HttpResponse.json(current);
  }),
  http.get('https://bean.elmz.life/balance/cumulative', () => {
    return HttpResponse.json(cumulative);
  }),
  http.get('https://bean.elmz.life/portfolio/holding', () => {
    return HttpResponse.json(holding);
  }),
  http.get('https://bean.elmz.life/balance/short_assets', () => {
    return HttpResponse.json(short_assets);
  }),
  http.get('https://pro-8910668211600497001.frontendapi.corbado.io/v2/session-config', () => {
    return HttpResponse.json({
      frontendApiUrl: 'https://pro-8910668211600497001.frontendapi.corbado.io',
      shortSessionCookieConfig: {
        domain: '',
        lifetimeSeconds: 86400,
        path: '/',
        sameSite: 'lax',
        secure: false,
      },
      useSessionManagement: true,
    });
  }),
];
