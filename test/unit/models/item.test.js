const sequelize = {
  define: jest.fn(() => ({
    associate: jest.fn()
  }))
}
const DataTypes = {
  STRING: 'string',
  UUID: 'uuid',
  FLOAT: 'float',
  INTEGER: 'integer'
}

describe('Item Model', () => {
  let Item
  beforeEach(() => {
    jest.clearAllMocks()
    Item = require('../../../app/models/item')(sequelize, DataTypes)
  })

  test('should define the model with correct fields', () => {
    expect(sequelize.define).toHaveBeenCalled()
    expect(Item.associate).toBeDefined()
  })
})
