const { StatusCodes } = require("http-status-codes");
const logger = require("./../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

module.exports = {
  method: "GET",
  path: "/healthz",
  options: {
    handler: (_request, h) => {
      try {
        return h.response("ok").code(StatusCodes.OK);
      } catch (err) {
        logger.logError(
          filenameForLogging,
          "get()",
          `Error running healthy check: ${err}`,
        );
        return h
          .response(`Error running healthy check: ${err.message}`)
          .code(StatusCodes.SERVICE_UNAVAILABLE);
      }
    },
  },
};
