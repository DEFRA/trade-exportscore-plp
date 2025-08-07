const parserModel = require("../../parser-model");
const combineParser = require("../../parser-combine");
const { mapPdfParser } = require("../../parser-map");
const logger = require("../../../utilities/logger");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const {
  extractPdf,
  extractEstablishmentNumbersFromString,
} = require("../../../utilities/pdf-helper");

async function parse(packingListDocument, sanitizedFullPackingList) {
  try {
    let establishmentNumber;
    let establishmentNumbers = [];

    if (
      regex.findMatch(headers.ICELAND1.establishmentNumber.regex, [
        packingListDocument.fields.PartialNIRMSNumber,
      ])
    ) {
      establishmentNumber = headers.ICELAND1.establishmentNumber.value;
    }
    const packingListContents = mapPdfParser(packingListDocument, "ICELAND1");

    if (!!sanitizedFullPackingList) {
      const pdfJson = await extractPdf(sanitizedFullPackingList);
      establishmentNumbers = extractEstablishmentNumbersFromString(
        pdfJson,
        headers.ICELAND1.establishmentNumber.establishmentRegex,
      );
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.ICELAND1,
      establishmentNumbers,
      headers.ICELAND1.findUnitInHeader,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return {};
  }
}

module.exports = {
  parse,
};
