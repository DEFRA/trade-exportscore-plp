const nonai = require('../../../app/routes/non-ai')
jest.mock('convert-excel-to-json')
jest.mock('../../../app/services/parser-service', () => ({
  ...jest.requireActual('../../../app/services/parser-service'),
  matchesBandM: jest.fn().mockResolvedValue(false),
  matchesAsda: jest.fn().mockResolvedValue(false)
}))
jest.mock('../../../app/packing-list/index', () => ({
  ...jest.requireActual('../../../app/packing-list/index'),
  createPackingList: jest.fn()
}))
jest.mock('../../../app/messaging/send-parsed-message', () => ({
  sendParsed: jest.fn()
}))

describe('/non-ai', () => {
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
