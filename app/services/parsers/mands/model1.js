const parserModel = require("../../parser-model");
const combineParser = require("../../parser-combine");
const { mapPdfParser } = require("../../parser-map");
const logger = require("../../../utilities/logger");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const {
  extractPdf,
  extractEstablishmentNumbers,
} = require("../../../utilities/pdf-helper");

async function parse(packingListDocument, sanitizedFullPackingList) {
  try {
    let establishmentNumber;
    let establishmentNumbers;
    if (
      regex.findMatch(headers.MANDS1.establishmentNumber.regex, [
        packingListDocument.fields.NIRMSNumber,
      ])
    ) {
      establishmentNumber = packingListDocument.fields.NIRMSNumber.content;
    }

    const packingListContents = mapPdfParser(packingListDocument, "MANDS1");
    if (sanitizedFullPackingList) {
      const pdfJson = await extractPdf(sanitizedFullPackingList);
      establishmentNumbers = extractEstablishmentNumbers(
        pdfJson,
        headers.MANDS1.establishmentNumber.establishmentRegex,
      );
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.MANDS1,
      establishmentNumbers,
      headers.MANDS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return {};
  }
}

module.exports = {
  parse,
};
