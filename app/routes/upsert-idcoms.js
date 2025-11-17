/**
 * Upsert IdComs route
 *
 * Triggers sending a parsed message to the IdComs topic based on
 * query parameters. Returns an HTTP status code value in the body
 * to indicate the operation result.
 */
const { sendParsed } = require("../messaging/send-parsed-message");
const { StatusCodes } = require("http-status-codes");
const logger = require("./../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Send parsed message to IdComs topic.
 * @param {Object} request - Hapi request object
 * @returns {Promise<number>} HTTP status code
 */
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
