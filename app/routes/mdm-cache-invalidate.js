const mdmBlobCache = require("../services/cache/mdm-blob-cache-service");
const { StatusCodes } = require("http-status-codes");
const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

module.exports = {
  method: "DELETE",
  path: "/mdm/cache",
  options: {
    handler: async (request, h) => {
      try {
        await mdmBlobCache.clear();

        logger.logInfo(
          filenameForLogging,
          "delete()",
          "Successfully invalidated MDM cache",
        );

        return h
          .response({
            success: true,
            message: "MDM cache successfully invalidated",
          })
          .code(StatusCodes.OK);
      } catch (err) {
        logger.logError(
          filenameForLogging,
          "delete()",
          `Failed to invalidate cache: ${err.message}`,
        );

        return h
          .response({
            success: false,
            error: err.message,
          })
          .code(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    },
  },
};
