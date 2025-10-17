const hapi = require("@hapi/hapi");
const config = require("./config");
const { sequelize } = require("./services/database-service");
const messageService = require("./messaging");
const logger = require("./utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

async function createServer() {
  try {
    if (
      config.dbConfig.development.database ||
      config.dbConfig.test.database ||
      config.dbConfig.production.database
    ) {
      await sequelize.authenticate();
    }
  } catch (err) {
    logger.logError(
      filenameForLogging,
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
    logger.logError(filenameForLogging, "createServer > hapi.server()", err);
  }

  try {
    // Register the plugins
    await server.register(require("./plugins/router"));
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "createServer > server.register()",
      err,
    );
  }

  try {
    if (config.isDev) {
      await server.register(require("blipp"));
    }
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "createServer > server.register() [DEV]",
      err,
    );
  }
  await serverMessage();
  return server;
}

async function serverMessage() {
  try {
    await messageService.start();
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "createServer > messageService.start()",
      err,
    );
  }

  process.on("SIGTERM", async function () {
    try {
      await messageService.start();
    } catch (err) {
      logger.logError(
        filenameForLogging,
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
        filenameForLogging,
        "createServer > messageService.stop()",
        err,
      );
    } finally {
      process.exit(0);
    }
  });
}

module.exports = createServer;
