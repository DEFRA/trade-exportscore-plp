const logger = require("./utilities/logger");

require("./services/app-insights").setup();
const createServer = require("./server");

createServer()
  .then((server) => server.start())
  .catch((err) => {
    logger.logError("app/index.js", "createServer()", err);
    process.exit(1);
  });
