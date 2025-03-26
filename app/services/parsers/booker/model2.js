const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { mapPdfNonAiParser } = require('../../../services/parser-map')
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();

async function parse(packingList) {
  try {
    let packingListContents = [];
    let packingListContentsTemp = [];

    const pdfJson = await pdfExtract.extractBuffer(packingList);

    const establishmentNumber = regex.findMatch(
      headers.BOOKER2.establishmentNumber.regex,
      pdfJson.pages[0].content,
    );

    for (const page of pdfJson.pages) {
      packingListContentsTemp = mapPdfNonAiParser(page, "BOOKER2");
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BOOKER2
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
