const combineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.TESCO2.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      0,
      2,
      headers.TESCO2.headers,
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.TESCO2,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/tescos/model2.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
