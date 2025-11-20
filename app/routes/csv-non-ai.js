/**
 * CSV non-AI route
 *
 * Converts a CSV packing list to parser JSON and returns the
 * structured packing list result.
 */
const config = require("../config");
const { StatusCodes } = require("http-status-codes");
const { processCsvFile } = require("../utilities/file-processor");

module.exports = {
  method: "GET",
  path: "/csv-non-ai",
  handler: async (request, h) => {
    const filename = config.plDir + request.query.filename;

    const packingList = await processCsvFile(
      filename,
      request.query.dispatchlocation,
    );
    return h.response(packingList).code(StatusCodes.OK);
  },
};
