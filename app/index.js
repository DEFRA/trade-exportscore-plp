/**
 * Application entry point
 *
 * Initializes Application Insights, creates the Hapi server, and starts
 * listening for requests. Fatal errors during startup cause process exit.
 */
const logger = require("./utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

require("./services/app-insights").setup();
const createServer = require("./server");

createServer()
  .then((server) => server.start())
  .catch((err) => {
    logger.logError(filenameForLogging, "createServer()", err);
    process.exit(1);
  });
