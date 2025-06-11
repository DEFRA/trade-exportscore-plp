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
      regex.findMatch(headers.GREGGS1.establishmentNumber.regex, [
        packingListDocument.fields.NIRMSNumber,
      ])
    ) {
      establishmentNumber = packingListDocument.fields.NIRMSNumber.content;
    } else {
      establishmentNumber =
        packingListDocument.fields.PackingListContents?.values.find((x) =>
          regex.findMatch(headers.GREGGS1.establishmentNumber.regex, [
            x.properties[headers.GREGGS1.headers.remos_number],
          ]),
        ).properties[headers.GREGGS1.headers.remos_number].value;
    }

    const packingListContents = mapPdfParser(packingListDocument, "GREGGS1");

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.GREGGS1,
      headers.GREGGS1.findUnitInHeader,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return {};
  }
}

module.exports = {
  parse,
};
