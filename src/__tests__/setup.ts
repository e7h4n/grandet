import { server } from '../mocks/node'
import { beforeAll, afterAll, beforeEach } from 'vitest'

beforeAll(() => {
    server.listen()
})

afterAll(() => {
    server.close()
})

beforeEach(() => {
    server.resetHandlers()
})