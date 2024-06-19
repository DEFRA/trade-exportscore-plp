jest.mock('../../../app/config', () => {
  return {
    env: 'development',
    dbConfig: {
      development: {
        database: 'development',
        username: 'postgres',
        password: '<PASSWORD>',
        host: 'localhost',
        dialect: 'postgres',
        hooks: {
          beforeConnect: jest.fn()
        },
        dialectOptions: {
          ssl: false
        },
        retry: {
          backoffBase: 500,
          backoffExponent: 1.1,
          match: [/SequelizeConnectionError/],
          max: 10,
          name: 'connection',
          timeout: 60000
        }
      },
      production: {
        database: 'production',
        username: 'postgres',
        password: '<PASSWORD>',
        host: 'localhost',
        dialect: 'postgres',
        hooks: {
          beforeConnect: jest.fn()
        },
        dialectOptions: {
          ssl: false
        },
        retry: {
          backoffBase: 500,
          backoffExponent: 1.1,
          match: [/SequelizeConnectionError/],
          max: 10,
          name: 'connection',
          timeout: 60000
        }
      },
      test: {
        database: 'test',
        username: 'postgres',
        password: '<PASSWORD>',
        host: 'localhost',
        dialect: 'postgres',
        hooks: {
          beforeConnect: jest.fn()
        },
        dialectOptions: {
          ssl: false
        },
        retry: {
          backoffBase: 500,
          backoffExponent: 1.1,
          match: [/SequelizeConnectionError/],
          max: 10,
          name: 'connection',
          timeout: 60000
        }
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

  test('should call Sequelize constructor with correct arguments', async () => {
    fs.readdirSync = jest.fn().mockReturnValue(['index.js'])
    require('../../../app/services/database-service')
    expect(Sequelize).toHaveBeenCalled()
  })
})
