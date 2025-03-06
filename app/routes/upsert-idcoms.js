const { sendParsed } = require("../messaging/send-parsed-message");
const { StatusCodes } = require("http-status-codes");
const logger = require("./../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

async function upsert(request) {
  let checkStatus = StatusCodes.NOT_FOUND;
  try {
    await sendParsed(request.query.applicationId, request.query.isApproved);

    checkStatus = StatusCodes.OK;
  } catch (err) {
    logger.logError(filenameForLogging, "get() > sendParsed", err);
  }
  return checkStatus;
}

module.exports = {
  method: "GET",
  path: "/upsert-idcoms",
  options: {
    handler: async (request, h) => {
      try {
        let checkStatus = StatusCodes.NOT_FOUND;
        if (request.query.applicationId) {
          checkStatus = await upsert(request);
        }
        return h.response(checkStatus).code(StatusCodes.OK);
      } catch (err) {
        logger.logError(filenameForLogging, "get()", err);
        return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
      }
    },
  },
};
