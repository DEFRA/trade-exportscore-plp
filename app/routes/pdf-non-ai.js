const config = require("../config");
const pdfHelper = require('../utilities/pdf-helper');
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
    //console.log(foundRMSElement);
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
    //console.log(foundHighestHeaderElement);
    const startOfTableYCooord =
      foundHighestHeaderElement.y - foundHighestHeaderElement.height;
    // We now have the pixels of Y of the top of the table
    // We don't bother finding the footer as it's not consistent across the pages


    // to be replaced with helper function to find all x and y values
    //console.log(pages[0].content)
    const packingListContents = [];

    for (const page of pages) {
      const xs = pdfHelper.getXsForHeaders(page.content);
      const ys = pdfHelper.getYsForRows(page.content);

      ys.forEach(y => {
        const plRow = {
          description: page.content.filter(item => (Math.round(item.y) === Math.round(y)) && (Math.round(item.x) === Math.round(xs.description) && (item.str.trim() !== '')))[0]?.str ?? null,
          number_of_packages: page.content.filter(item => (Math.round(item.y) === Math.round(y)) && (Math.round(item.x) === Math.round(xs.packages) && (item.str.trim() !== '')))[0]?.str ?? null,
          total_net_weight_kg: page.content.filter(item => (Math.round(item.y) === Math.round(y)) && (Math.round(item.x) === Math.round(xs.weight) && (item.str.trim() !== '')))[0]?.str ?? null,
          commodity_code: page.content.filter(item => (Math.round(item.y) === Math.round(y)) && (Math.round(item.x) === Math.round(xs.commodityCode) && (item.str.trim() !== '')))[0]?.str ?? null
        }
        packingListContents.push(plRow);
      })
    }

    return h.response(packingListContents).code(200);
  },
};
