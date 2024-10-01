const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.TESCO1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContentsRow = 5;
    const packingListContents = mapParser(
      packingListJson,
      packingListContentsRow - 1,
      packingListContentsRow,
      headers.TESCO1.headers,
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.TESCO1,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/tescos/model1.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
