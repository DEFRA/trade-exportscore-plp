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
      regex.findMatch(headers.BOOKER1.establishmentNumber.regex, [
        packingListDocument.fields.NIRMSNumber,
      ])
    ) {
      establishmentNumber = packingListDocument.fields.NIRMSNumber.content;
    }

    const transformedContents = transformPackingList(packingListDocument);

    const packingListContents = mapPdfParser(transformedContents, "BOOKER1");

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BOOKER1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return {};
  }
}

function transformPackingList(packingListDocument) {
  if (packingListDocument.fields.PackingListContents.values) {
    for (const value of packingListDocument.fields.PackingListContents.values) {
      if (value.properties.Boxes.value) {
        value.properties.Boxes.value =
          value.properties?.Boxes.value?.match(/\d*/)[0];
      }
    }
  }

  return packingListDocument;
}

module.exports = {
  parse,
  transformPackingList,
};
