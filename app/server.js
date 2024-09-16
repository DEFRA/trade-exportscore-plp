const hapi = require("@hapi/hapi");
const config = require("./config");
const { sequelize } = require("./services/database-service");
const messageService = require("./messaging");

async function createServer() {
  console.log("Running the createServer method");
  try {
    await sequelize.authenticate();

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
  } catch (error) {
    console.error("createServer encountered an error: ", error);
  }
}

module.exports = createServer;
