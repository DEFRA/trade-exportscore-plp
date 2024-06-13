const hapi = require('@hapi/hapi')
const config = require('./config')
const { sequelize } = require('./services/database-service')

async function createServer () {
  await sequelize.authenticate()

  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(require('./plugins/router'))

  if (config.isDev) {
    await server.register(require('blipp'))
  }

  return server
}

module.exports = createServer
