const logger = require("./utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

require("./services/app-insights").setup();
const createServer = require("./server");

createServer()
  .then((server) => server.start())
  .catch((err) => {
    logger.logError(filenameForLogging, "createServer()", err);
    process.exit(1);
  });
