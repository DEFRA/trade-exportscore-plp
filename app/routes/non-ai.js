const config = require("../config");
const { StatusCodes } = require("http-status-codes");
const { processExcelFile } = require("../utilities/file-processor");

module.exports = {
  method: "GET",
  path: "/non-ai",
  handler: async (request, h) => {
    const filename = config.plDir + request.query.filename;

    const packingList = await processExcelFile(
      filename,
      request.query.dispatchlocation,
    );
    return h.response(packingList).code(StatusCodes.OK);
  },
};
