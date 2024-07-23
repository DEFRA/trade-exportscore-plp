const upsertIdcoms = require('../../../app/routes/upsert-idcoms')

jest.mock('../../../app/services/dynamics-service')

const { patchPackingListCheck } = require('../../../app/services/dynamics-service')

const mockResponse = { response: 200, code: 200 }

patchPackingListCheck.mockImplementation(() => {
   response: 200; code: 200 }
).mockName('add42');
const mockApplicationId = 123

const mockHandler = jest.fn();

mockHandler.mockResolvedValue(() => {
  return mockResponse
})

console.error = jest.fn();

describe('upsert idcoms', () => {
  afterAll(async () => {
    jest.resetAllMocks()
  })

  test('should not call the upsert when application id not is specified', async () => {
    const mockHandler = {}

    await upsertIdcoms.options.handler({}, mockHandler)

    expect(patchPackingListCheck).not.toHaveBeenCalled()
  })

  test('should log the exception when an error occurs', async () => {

    await upsertIdcoms.options.handler({}, mockHandler)

    expect(patchPackingListCheck).not.toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe("Error running upsert: ");
  })

  test('should perform the upsert when application id is specified and isParsed is true', async () => {

    await upsertIdcoms.options.handler({ query: { applicationId: mockApplicationId, isParsed: true } }, mockHandler)

    expect(patchPackingListCheck).toHaveBeenCalledWith(mockApplicationId, true)
  })

  test('should perform the upsert when application id is specified and isParsed is false', async () => {

    await upsertIdcoms.options.handler({ query: { applicationId: mockApplicationId, isParsed: false } }, mockHandler)

    expect(patchPackingListCheck).toHaveBeenCalledWith(mockApplicationId, false)
  })
})
