const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { mapPdfNonAiParser } = require("../../../services/parser-map");
const { extractPdf } = require("../../../utilities/pdf-helper");

async function parse(packingList) {
  try {
    let packingListContents = [];
    let packingListContentsTemp = [];

    const pdfJson = await extractPdf(packingList);

    const establishmentNumber = regex.findMatch(
      headers.BOOKER1.establishmentNumber.regex,
      pdfJson.pages[0].content,
    );

    for (const page of pdfJson.pages) {
      packingListContentsTemp = mapPdfNonAiParser(page, "BOOKER1L");
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BOOKER1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
