const { sendParsed } = require("../messaging/send-parsed-message");
const { patchPackingListCheck } = require("../services/dynamics-service");
const { StatusCodes } = require("http-status-codes");
const config = require("../config");
const logger = require("./../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

async function upsertWithDynamics(request) {
  let checkStatus = StatusCodes.NOT_FOUND;
  try {
    checkStatus = await patchPackingListCheck(
      request.query.applicationId,
      request.query.isApproved,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "get() > patchPackingListCheck", err);
  }
  return checkStatus;
}

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
          if (config.isDynamicsIntegration) {
            checkStatus = await upsertWithDynamics(request);
          } else {
            checkStatus = await upsert(request);
          }
        }
        return h.response(checkStatus).code(StatusCodes.OK);
      } catch (err) {
        logger.logError(filenameForLogging, "get()", err);
      }
    },
  },
};
