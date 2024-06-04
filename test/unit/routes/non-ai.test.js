const nonai = require('../../../app/routes/non-ai')

describe('/non-ai', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('should return success', async () => {
    const mockRequest = {}
    const mockH = {
      response: jest.fn(() => {
        return {
          code: jest.fn()
        }
      })
    }

    await nonai.handler(mockRequest, mockH)

    expect(mockH.response).toHaveBeenCalled()
  })
})
