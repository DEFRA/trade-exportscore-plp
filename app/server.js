const hapi = require("@hapi/hapi");
const config = require("./config");
const { sequelize } = require("./services/database-service");
const messageService = require("./messaging");
const logger = require("./utilities/logger");

async function createServer() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    logger.log_error(
      "app/server.js",
      "createServer > sequelize.authenticate()",
      err,
    );
  }

  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false,
        },
      },
    },
  });

  // Register the plugins
  await server.register(require("./plugins/router"));

  if (config.isDev) {
    await server.register(require("blipp"));
  }

  await messageService.start();

  process.on("SIGTERM", async function () {
    await messageService.stop();
    process.exit(0);
  });

  process.on("SIGINT", async function () {
    await messageService.stop();
    process.exit(0);
  });

  return server;
}

module.exports = createServer;
