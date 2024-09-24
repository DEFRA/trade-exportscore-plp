const { StatusCodes } = require("http-status-codes");
const logger = require("./../utilities/logger");

module.exports = {
  method: "GET",
  path: "/healthz",
  options: {
    handler: (_request, h) => {
      try {
        return h.response("ok").code(StatusCodes.OK);
      } catch (err) {
        logger.log_error(
          "app/routes/healthz.js",
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
