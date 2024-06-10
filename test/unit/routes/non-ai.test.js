const nonai = require('../../../app/routes/non-ai')
jest.mock('convert-excel-to-json')
jest.mock('../../../app/services/parser-service', () => ({
  matchesBandM: jest.fn().mockResolvedValue(false),
  matchesAsda: jest.fn().mockResolvedValue(false)
}))

describe('/non-ai', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('should return success', async () => {
    jest.mock('convert-excel-to-json')
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
