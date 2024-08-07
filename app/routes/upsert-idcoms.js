const { sendParsed } = require("../messaging/send-parsed-message");
const { patchPackingListCheck } = require("../services/dynamics-service");
const { StatusCodes } = require("http-status-codes");
const config = require("../config");

module.exports = {
  method: "GET",
  path: "/upsert-idcoms",
  options: {
    handler: async (request, h) => {
      try {
        console.log(config);
        let checkStatus = StatusCodes.NOT_FOUND;
        if (request.query.applicationId) {
          if (config.isDynamicsIntegration) {
            checkStatus = await patchPackingListCheck(
              request.query.applicationId,
              request.query.isParsed,
            );
          } else {
            await sendParsed(
              request.query.isParsed,
              request.query.applicationId,
            );
            checkStatus = StatusCodes.OK;
          }
        }
        return h.response(checkStatus).code(StatusCodes.OK);
      } catch (err) {
        console.error("Error running upsert: ", err);
      }
    },
  },
};
