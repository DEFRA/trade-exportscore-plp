/**
 * Hapi server creation and configuration
 *
 * Creates and configures the Hapi server with database connectivity,
 * plugin registration, and message service initialization. SIGTERM/SIGINT
 * handlers ensure graceful shutdown of messaging connections.
 */
const hapi = require("@hapi/hapi");
const config = require("./config");
const { sequelize } = require("./services/database-service");
const messageService = require("./messaging");
const logger = require("./utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Create and configure Hapi server instance.
 * @returns {Promise<Object>} Configured Hapi server
 */
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

/**
 * Initialize message service and register signal handlers.
 * @returns {Promise<void>}
 */
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
