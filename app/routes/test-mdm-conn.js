const { getNirmsProhibitedItems } = require("../services/mdm-service");
const { StatusCodes } = require("http-status-codes");
const logger = require("./../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

module.exports = {
  method: "GET",
  path: "/test-mdm-conn",
  options: {
    handler: async (request, h) => {
      try {
        const nirmsData = await getNirmsProhibitedItems();

        if (nirmsData) {
          logger.logInfo(
            filenameForLogging,
            "get()",
            "Successfully retrieved NIRMS data from MDM API",
          );
          return h.response(nirmsData).code(StatusCodes.OK);
        } else {
          logger.logError(
            filenameForLogging,
            "get()",
            "Failed to retrieve NIRMS data from MDM API",
          );
          return h
            .response({ error: "Failed to retrieve NIRMS data" })
            .code(StatusCodes.SERVICE_UNAVAILABLE);
        }
      } catch (err) {
        logger.logError(filenameForLogging, "get()", err);
        return h.response(err.message).code(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    },
  },
};
