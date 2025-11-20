/**
 * Non-AI Excel route
 *
 * Provides a simple GET endpoint that converts an Excel packing list
 * to the parser JSON using the local `file-processor` utilities and
 * returns the structured result.
 */
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
