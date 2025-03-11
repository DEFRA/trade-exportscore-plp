const config = require("../config");

const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();

const { PdfDataParser } = require("pdf-data-parser");

module.exports = {
  method: "GET",
  path: "/pdf-non-ai",
  handler: async (_request, h) => {
    const filename = config.plDir + _request.query.filename;
    // First off, we need the RMS number and the starting position of the main table
    let outcome;
    try {
      outcome = await pdfExtract.extract(filename);
    } catch (err) {
      console.error(err);
      return h.response(`notok: ${err}`).code(500);
    }

    const pages = outcome.pages;

    // Find the RMS number
    let foundRMSElement = null;
    const rmsRegex = /^RMS-GB-\d{6}-\d{3}$/;
    for (const page of pages) {
      for (const element of page.content) {
        if (rmsRegex.test(element.str)) {
          foundRMSElement = element;
          break;
        }
      }
      if (foundRMSElement) break;
    }
    console.log(foundRMSElement);
    const RMS = foundRMSElement.str;

    // Find the starting position of the table
    // Given that # is _lower_ than some of the other header text, find the one that's the highest y coords as the starter
    let foundHighestHeaderElement = null;
    const hash = "No. and";
    for (const page of pages) {
      for (const element of page.content) {
        if (element.str === hash) {
          foundHighestHeaderElement = element;
          break;
        }
      }
      if (foundHighestHeaderElement) break;
    }
    console.log(foundHighestHeaderElement);
    const startOfTableYCooord =
      foundHighestHeaderElement.y - foundHighestHeaderElement.height;
    // We now have the pixels of Y of the top of the table
    // We don't bother finding the footer as it's not consistent across the pages

    const pdfParser = new PdfDataParser({
      url: filename,
      newlines: false,
      // repeatingHeaders: true   can't use this as there's repeating headers but with a table above that stops this functionality working
      pageHeader: startOfTableYCooord,
      repeatingHeaders: true,
    });

    const rows = await pdfParser.parse();

    // Rows contains an array of arrays
    // It's all the pages collapsed together into a large array, we

    // First off, we need to find the array that contains

    return h.response(rows).code(200);
  },
};
