require("./services/app-insights").setup();
const createServer = require("./server");

createServer()
  .then((server) => server.start())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
