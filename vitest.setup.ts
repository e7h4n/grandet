import { server } from './src/mocks/node';
import { beforeAll, afterAll, beforeEach } from 'vitest';

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  server.resetHandlers();
});
