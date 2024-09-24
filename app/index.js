const logger = require("./utilities/logger");

require("./services/app-insights").setup();
const createServer = require("./server");

createServer()
  .then((server) => server.start())
  .catch((err) => {
    logger.log_error("app/index.js", "createServer()", error);
    console.error(err);
    process.exit(1);
  });
