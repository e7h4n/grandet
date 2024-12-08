import { http, HttpResponse } from 'msw'
import navIndex from './nav_index.json';

export const handlers = [
    http.get('/Portfolio/nav_index', () => {
        return HttpResponse.json(navIndex)
    }),
]