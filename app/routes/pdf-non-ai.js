/**
 * PDF non-AI parsing route
 *
 * Provides a simple GET endpoint that converts a PDF packing list
 * to the parser JSON using the local `file-processor` utilities and
 * returns the structured result.
 */
const config = require("../config");
const { StatusCodes } = require("http-status-codes");
const { processPdfFile } = require("../utilities/file-processor");
// Uncomment to see pdf elements positions
// const PDFExtract = require("pdf.js-extract").PDFExtract;
// const pdfExtract = new PDFExtract();

module.exports = {
  method: "GET",
  path: "/pdf-non-ai",
  handler: async (request, h) => {
    const filename = config.plDir + request.query.filename;

    const packingList = await processPdfFile(
      filename,
      request.query.dispatchlocation,
    );

    // Uncomment to see pdf elements positions
    //const packing = await pdfExtract.extractBuffer(result);

    return h.response(packingList).code(StatusCodes.OK);
  },
};
