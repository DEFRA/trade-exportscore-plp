const nonai = require('../../../app/routes/non-ai')
jest.mock('convert-excel-to-json')
jest.mock('../../../app/packing-list/index', () => ({
  ...jest.requireActual('../../../app/packing-list/index'),
  createPackingList: jest.fn()
}))

describe('/non-ai', () => {
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
