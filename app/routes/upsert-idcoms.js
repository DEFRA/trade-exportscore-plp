const { sendParsed } = require("../messaging/send-parsed-message");
const { patchPackingListCheck } = require("../services/dynamics-service");
const { StatusCodes } = require("http-status-codes");
const { isDynamicsIntegration } = require("../config").isDynamicsIntegration;

module.exports = {
  method: "GET",
  path: "/upsert-idcoms",
  options: {
    handler: async (request, h) => {
      try {
        let checkStatus = StatusCodes.NOT_FOUND;
        if (request.query.applicationId) {
          if (isDynamicsIntegration) {
            checkStatus = await patchPackingListCheck(
              request.query.applicationId,
              request.query.isParsed,
            );
          } else {
            await sendParsed(
              request.query.isParsed,
              request.query.applicationId,
            );
          }
        }
        return h.response(checkStatus).code(StatusCodes.OK);
      } catch (err) {
        console.error("Error running upsert: ", err);
      }
    },
  },
};
