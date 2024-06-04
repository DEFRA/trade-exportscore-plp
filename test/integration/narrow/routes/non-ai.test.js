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