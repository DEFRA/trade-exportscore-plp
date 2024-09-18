const hapi = require('@hapi/hapi')
const config = require('./config')
const { sequelize } = require('./services/database-service')
const messageService = require('./messaging')

async function createServer () {
  let server

  try {
    await sequelize.authenticate()
  } catch (err) {
    console.error(`sequelize.authenticate() failed with: ${err}`)
  }

  try {
    server = hapi.server({
      port: config.port,
      routes: {
        validate: {
          options: {
            abortEarly: false
          }
        }
      }
    })
  } catch (err) {
    console.error(`hapi.server() failed with: ${err}`)
  }

  try {
    await server.register(require('./plugins/router'))
  } catch (err) {
    console.error(`server.register() failed to register the plugins with: ${err}`)
  }

  try {
    if (config.isDev) {
      await server.register(require('blipp'))
    }
  } catch (err) {
    console.error(`In Dev, server.register() failed to register the blipp with: ${err}`)
  }

  try {
    await messageService.start()
  } catch (err) {
    console.error(`messageService.start() failed to start with: ${err}`)
  }

  process.on('SIGTERM', async function () {
    try {
      await messageService.stop()
      process.exit(0)
    } catch (err) {
      console.error(`process.on("SIGTERM") failed to stop with: ${err}`)
    }
  })

  process.on('SIGINT', async function () {
    try {
      await messageService.stop()
      process.exit(0)
    } catch (err) {
      console.error(`process.on("SIGINT") failed to stop with: ${err}`)
    }
  })

  return server
}

module.exports = createServer
