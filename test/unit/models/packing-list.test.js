const sequelize = {
  define: jest.fn(() => ({
    associate: jest.fn()
  }))
}
const DataTypes = {
  STRING: 'string',
  BIIKEAN: 'boolean',
  INTEGER: 'integer'
}

describe('Packing list Model', () => {
  let PackingList
  beforeEach(() => {
    jest.clearAllMocks()
    PackingList = require('../../../app/models/packing-list')(sequelize, DataTypes)
  })

  afterAll(async () => {
    jest.resetAllMocks()
    await sequelize.close
  })

  test('should define the model with correct fields', () => {
    expect(sequelize.define).toHaveBeenCalled()
    expect(PackingList.associate).toBeDefined()
  })
})
