const hapi = require('@hapi/hapi')
const config = require('./config')
const { sequelize } = require('./services/database-service')
const messageService = require('./messaging')

async function createServer () {
  let server

  try {
    await sequelize.authenticate()
  } catch (err) {
    console.error(`sequelize.authenticate() in server.createServer() failed with: ${err}`)
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
    console.error(`hapi.server() in server.createServer() failed with: ${err}`)
  }

  try {
    await server.register(require('./plugins/router'))
  } catch (err) {
    console.error(`server.register() in server.createServer() failed to register the plugins with: ${err}`)
  }

  try {
    if (config.isDev) {
      await server.register(require('blipp'))
    }
  } catch (err) {
    console.error(`In Dev, server.register() in server.createServer() failed to register the blipp with: ${err}`)
  }

  try {
    await messageService.start()
  } catch (err) {
    console.error(`messageService.start() in server.createServer() failed to start with: ${err}`)
  }

  process.on('SIGTERM', async function () {
    try {
      await messageService.stop()
      process.exit(0)
    } catch (err) {
      console.error(`process.on("SIGTERM") in server.createServer() failed to stop with: ${err}`)
    }
  })

  process.on('SIGINT', async function () {
    try {
      await messageService.stop()
      process.exit(0)
    } catch (err) {
      console.error(`process.on("SIGINT") in server.createServer() failed to stop with: ${err}`)
    }
  })

  return server
}

module.exports = createServer
