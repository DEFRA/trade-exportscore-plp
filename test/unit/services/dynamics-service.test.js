const dynamicsService = require('../../../app/services/dynamics-service')

jest.mock('../../../app/config', () => {
  return {
    dynamicsConfig: {
      bearerTokenRequest: {
        url: 'test',
        grantType: 'grant type',
        clientId: 'test id',
        clientSecret: 'test secret'
      },
      dynamicsUrl: '123'
    }
  }
})

describe('bearerTokenRequest', () => {
  test('returns token', async () => {
    // arrange
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ access_token: 'abc' })
      })
    )

    // act
    const result = await dynamicsService.bearerTokenRequest()

    // assert
    expect(result).toBe('abc')
  })

  test('returns error', async () => {
    // arrange
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ access_token: 'abc' })
      })
    )

    // act
    const result = await dynamicsService.bearerTokenRequest()

    // assert
    expect(result).toBe('Response status: 400')
  })
})

describe('patchPackingListCheck', () => {
  test('upserts', async () => {
    // arrange
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ access_token: 'abc' })
      })
    )
    dynamicsService.bearerTokenRequest = jest.fn().mockResolvedValueOnce('abc')

    // act
    const result = await dynamicsService.patchPackingListCheck('123', true)

    expect(result).toBe(200)
  })
})
