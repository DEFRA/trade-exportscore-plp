const { patchPackingListCheck } = require("../services/dynamics-service");
const { StatusCodes } = require("http-status-codes");

module.exports = {
  method: "GET",
  path: "/upsert-idcoms",
  options: {
    handler: async (request, h) => {
      try {
        let checkStatus = StatusCodes.NOT_FOUND;
        if (request.query.applicationId) {
          checkStatus = await patchPackingListCheck(
            request.query.applicationId,
            request.query.isParsed,
          );
        }
        return h.response(checkStatus).code(StatusCodes.OK);
      } catch (err) {
        console.error("Error running upsert: ", err);
      }
    },
  },
};
