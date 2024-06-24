const { sequelize } = require('../../app/services/database-service')
const createServer = require('../../app/server')

jest.mock('../../app/services/database-service', () => ({
  sequelize: {
    authenticate: jest.fn()
  }
}))

jest.mock('../../app/messaging', () => ({
  start: jest.fn()
}))

jest.mock('../../app/config', () => ({
  isDev: true
}))

describe('cresteServer', () => {
  test('should create server', async () => {
    sequelize.authenticate.mockResolvedValue()

    const result = await createServer()

    console.log(result)
    expect(result.registrations.router).toBeDefined()
    expect(result.registrations.blipp).toBeDefined()
  })
})
