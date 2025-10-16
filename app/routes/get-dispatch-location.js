const { getDispatchLocation } = require("../services/dynamics-service");
const { StatusCodes } = require("http-status-codes");
const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

module.exports = {
  method: "GET",
  path: "/get-dispatch-location",
  options: {
    handler: async (request, h) => {
      try {
        let dispatchLocation = "";
        if (request.query.applicationId) {
          dispatchLocation = await getDispatchLocation(
            request.query.applicationId,
          );
        }
        return h.response(dispatchLocation).code(StatusCodes.OK);
      } catch (err) {
        logger.logError(filenameForLogging, "get()", err);
        return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
      }
    },
  },
};
