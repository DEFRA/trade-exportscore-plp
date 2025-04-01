const config = require("../config");
const { findParser } = require("../services/parser-service");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const logger = require("../utilities/logger");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();

module.exports = {
  method: "GET",
  path: "/pdf-non-ai",
  handler: async (_request, h) => {
    const filename = config.plDir + _request.query.filename;
    let result = {};

    try {
      result = fs.readFileSync(filename);
    } catch (err) {
      logger.logError("app/routes/pdf-non-ai.js", "get()", err);
      return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }

    const packing = await pdfExtract.extractBuffer(result);
    const packingList = await findParser(result, filename);

    return h.response(packingList).code(StatusCodes.OK);
  },
};
