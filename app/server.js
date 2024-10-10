const hapi = require("@hapi/hapi");
const config = require("./config");
const { sequelize } = require("./services/database-service");
const messageService = require("./messaging");
const logger = require("./utilities/logger");
const logServerPath = "app/server.js";

async function createServer() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    logger.logError(
      logServerPath,
      "createServer > sequelize.authenticate()",
      err,
    );
  }

  let server;
  try {
    // Create the hapi server
    server = hapi.server({
      port: config.port,
      routes: {
        validate: {
          options: {
            abortEarly: false,
          },
        },
      },
    });
  } catch (err) {
    logger.logError(logServerPath, "createServer > hapi.server()", err);
  }

  try {
    // Register the plugins
    await server.register(require("./plugins/router"));
  } catch (err) {
    logger.logError(logServerPath, "createServer > server.register()", err);
  }

  try {
    if (config.isDev) {
      await server.register(require("blipp"));
    }
  } catch (err) {
    logger.logError(
      logServerPath,
      "createServer > server.register() [DEV]",
      err,
    );
  }

  try {
    await messageService.start();
  } catch (err) {
    logger.logError(
      logServerPath,
      "createServer > messageService.start()",
      err,
    );
  }

  process.on("SIGTERM", async function () {
    try {
      await messageService.start();
    } catch (err) {
      logger.logError(
        logServerPath,
        "createServer > messageService.start()",
        err,
      );
    }
    await messageService.stop();
    process.exit(0);
  });

  process.on("SIGINT", async function () {
    try {
      await messageService.stop();
    } catch (err) {
      logger.logError(
        logServerPath,
        "createServer > messageService.stop()",
        err,
      );
    } finally {
      process.exit(0);
    }
  });

  return server;
}

module.exports = createServer;
