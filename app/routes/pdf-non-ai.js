const config = require("../config");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const { findParser } = require("../services/parser-service");

module.exports = {
  method: "GET",
  path: "/pdf-non-ai",
  handler: async (_request, h) => {
    const filename = config.plDir + _request.query.filename;
    let outcome;

    try {
      outcome = await pdfExtract.extract(filename);
    } catch (err) {
      console.error(err);
      return h.response(`notok: ${err}`).code(500);
    }

    const pages = outcome.pages;
    const packingList = await findParser(pages, filename);

    return h.response(packingList).code(200);
  },
};
