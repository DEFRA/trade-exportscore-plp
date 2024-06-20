const { sequelize } = require('../../app/services/database-service')
const createServer = require('../../app/server')
const messageService = require('../../app/messaging')

jest.mock('../../app/services/database-service', () => ({
  sequelize: {
    authenticate: jest.fn()
  }
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
