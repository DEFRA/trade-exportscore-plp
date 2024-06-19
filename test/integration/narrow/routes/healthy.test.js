describe('Healthy test', () => {
  let server

  jest.mock('../../../../app/services/database-service')
  const createServer = require('../../../../app/server')
  const { sequelize } = require('../../../../app/services/database-service')
  sequelize.authenticate = jest.fn()

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /healthy returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }
    sequelize.authenticate.mockReturnValue(true)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /healthy returns 503 and error message if database check throws an error', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    const errorMessage = 'database connection timeout'
    sequelize.authenticate.mockImplementation(() => { throw new Error(errorMessage) })

    const response = await server.inject(options)

    expect(response.statusCode).toBe(503)
    expect(response.payload).toBe(`Error running healthy check: ${errorMessage}`)
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    jest.resetAllMocks()
    await sequelize.close()
    await server.stop()
  })
})
