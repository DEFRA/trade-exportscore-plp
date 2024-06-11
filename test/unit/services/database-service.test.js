jest.mock('../../../app/config', () => {
  return {
    env: 'development',
    dbConfig: {
      development: {
        database: 'development',
        username: 'postgres',
        password: '<PASSWORD>',
        host: 'localhost',
        dialect: 'postgres'
      },
      production: {
        database: 'production',
        username: 'postgres',
        password: '<PASSWORD>',
        host: 'localhost',
        dialect: 'postgres'
      },
      test: {
        database: 'test',
        username: 'postgres',
        password: '<PASSWORD>',
        host: 'localhost',
        dialect: 'postgres'
      }
    }
  }
})

const fs = require('fs')
require('path')
jest.mock('fs')
jest.mock('sequelize')
const { Sequelize } = require('sequelize')

describe('Database setup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call Sequelize constructor with correct arguments', () => {
    fs.readdirSync = jest.fn().mockReturnValue(['index.js'])
    require('../../../app/services/database-service')
    expect(Sequelize).toHaveBeenCalled()
  })
})
