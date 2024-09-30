const { sendParsed } = require("../messaging/send-parsed-message");
const { patchPackingListCheck } = require("../services/dynamics-service");
const { StatusCodes } = require("http-status-codes");
const config = require("../config");
const logger = require("./../utilities/logger");
const logUpsertIdcomsPath = "app/routes/upsert-idcoms.js";

module.exports = {
  method: "GET",
  path: "/upsert-idcoms",
  options: {
    handler: async (request, h) => {
      try {
        let checkStatus = StatusCodes.NOT_FOUND;
        if (request.query.applicationId) {
          if (config.isDynamicsIntegration) {
            try {
              checkStatus = await patchPackingListCheck(
                request.query.applicationId,
                request.query.isApproved,
              );
            } catch (err) {
              logger.log_error(
                logUpsertIdcomsPath,
                "get() > patchPackingListCheck",
                err,
              );
            }
          } else {
            try {
              await sendParsed(
                request.query.applicationId,
                request.query.isApproved,
              );
              checkStatus = StatusCodes.OK;
            } catch (err) {
              logger.log_error(logUpsertIdcomsPath, "get() > sendParsed", err);
            }
          }
        }
        return h.response(checkStatus).code(StatusCodes.OK);
      } catch (err) {
        logger.log_error(logUpsertIdcomsPath, "get()", err);
      }
    },
  },
};
