//jest.mock('../../../../app/services/parser-service')
jest.mock('convert-excel-to-json')
jest.mock('../../../../app/services/parser-service', () => ({
  matchesBandM: jest.fn().mockResolvedValue(false),
  matchesAsda: jest.fn().mockResolvedValue(false)
}));


describe('Non-ai test', () => {
    const server = require('../../../../app/server')
  
    beforeEach(async () => {
      await server.start()
    })

    test('GET /non-ai route returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/non-ai'
      }
  
      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
    })
  
    afterEach(async () => {
      await server.stop()
    })
  })