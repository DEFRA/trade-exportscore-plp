const config = require('../../../app/config/index')
const joi = require('joi')

jest.mock('../../../app/config/database-config', () => {
  return 'mock object'
})
jest.mock('../../../app/packing-list/index', () => ({
  packingListMapper: jest.fn().mockResolvedValue({}),
  createPackingList: jest.fn()
}))

describe('config index', () => {
  beforeEach(() => {
    joi.bool = jest.fn().mockImplementation(() => {
      return {
        default: jest.fn().mockReturnValue(false)
      }
    })

    joi.string = jest.fn().mockImplementation(() => {
      return {
        required: jest.fn().mockReturnThis(),
        optional: jest.fn().mockReturnThis(),
        default: jest.fn().mockReturnThis(),
        allow: jest.fn().mockReturnThis()
      }
    })

    jest.mock('joi', () => {
      return {
        validate: () => {
          return { value: 'obj', error: null }
        }
      }
    })
  })

  test('should be a valid object', () => {
    expect(config).toBeInstanceOf(Object)
  })
})
