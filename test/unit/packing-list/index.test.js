const mockDatabaseService = {
  models: {
    packingList: {
      create: jest.fn()
    }
  },
  sequelize: {
    transaction: jest
      .fn()
      .mockImplementation((callback) => Promise.resolve(callback()))
  }
}
jest.mock('../../../app/services/database-service', () => mockDatabaseService)

const { createPackingList } = require('../../../app/packing-list/index')

describe('Packing list', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('should create a new packing list if it not exists', async () => {
    const packingList = {
      registration_approval_number: 'remos',
      items: [],
      business_checks:
        {
          all_required_fields_present: true
        }
    }
    await createPackingList(packingList, '123')
    expect(mockDatabaseService.models.packingList.create).toHaveBeenCalled()
  })
})
