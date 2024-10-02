const parserModel = require("../../parser-model");
const combineParser = require("../../parser-combine");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.CDS1.establishmentNumber.regex,
      packingListJson,
    );

    const dataRow = 1;
    const packingListContents = mapParser(
      packingListJson,
      dataRow - 1,
      dataRow,
      headers.CDS1.headers,
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.CDS1,
    );
  } catch (err) {
    logger.log_error(filenameForLogging, "matches()", err);
  }
}

module.exports = {
  parse,
};
