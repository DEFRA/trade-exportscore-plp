const parserModel = require("../../parser-model");
const combineParser = require("../../parser-combine");
const { mapPdfParser } = require("../../parser-map");
const logger = require("../../../utilities/logger");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function parse(packingListDocument) {
  try {
    let establishmentNumber;
    if (
      regex.findMatch(headers.ICELAND1.establishmentNumber.regex, [
        packingListDocument.fields.PartialNIRMSNumber,
      ])
    ) {
      establishmentNumber = headers.ICELAND1.establishmentNumber.value;
    }
    const packingListContents = mapPdfParser(packingListDocument, "ICELAND1");

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.ICELAND1,
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
