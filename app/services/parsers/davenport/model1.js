const parserModel = require("../../parser-model");
const combineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.DAVENPORT1.establishmentNumber.regex,
      packingListJson,
    );

    const dataRow = 45;
    const packingListContents = mapParser(
      packingListJson,
      dataRow - 1,
      dataRow,
      headers.DAVENPORT1.headers,
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.DAVENPORT1,
    );
  } catch (err) {
    logger.log_error(
      "app/services/parsers/davenport/model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
