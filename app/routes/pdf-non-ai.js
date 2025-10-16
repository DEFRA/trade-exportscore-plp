const config = require("../config");
const { findParser } = require("../services/parser-service");
const fs = require("node:fs");
const { StatusCodes } = require("http-status-codes");
const logger = require("../utilities/logger");
// Uncomment to see pdf elements positions
// const PDFExtract = require("pdf.js-extract").PDFExtract;
// const pdfExtract = new PDFExtract();

module.exports = {
  method: "GET",
  path: "/pdf-non-ai",
  handler: async (request, h) => {
    const filename = config.plDir + request.query.filename;
    let result = {};

    try {
      result = fs.readFileSync(filename);
    } catch (err) {
      logger.logError("app/routes/pdf-non-ai.js", "get()", err);
      return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }

    const packingList = await findParser(
      result,
      filename,
      request.query.dispatchlocation,
    );
    // Uncomment to see pdf elements positions
    //const packing = await pdfExtract.extractBuffer(result);

    return h.response(packingList).code(StatusCodes.OK);
  },
};
