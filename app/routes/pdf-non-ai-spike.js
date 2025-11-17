const config = require("../config");
const { findParser } = require("../services/parser-service");
const fs = require("node:fs");
const { StatusCodes } = require("http-status-codes");
const logger = require("../utilities/logger");
// Uncomment to see pdf elements positions
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const { groupByYCoordinate } = require("../utilities/text-grouping");

module.exports = {
  method: "GET",
  path: "/pdf-non-ai-spike",
  handler: async (request, h) => {
    const filename = config.plDir + request.query.filename;
    let result = {};

    try {
      result = fs.readFileSync(filename);
    } catch (err) {
      logger.logError("app/routes/pdf-non-ai-spike.js", "get()", err);
      return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }

    // Uncomment to see pdf elements positions
    const packing = await pdfExtract.extractBuffer(result);

    // group by y if y is less than threshold of 10

    const resultGroup = groupByYCoordinate(packing.pages[0].content, 10); // threshold = 10

    return h.response(resultGroup).code(StatusCodes.OK);
  },
};
