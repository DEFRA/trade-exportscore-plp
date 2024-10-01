const combineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.ASDA1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      0,
      1,
      headers.ASDA1.headers,
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.ASDA1,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/asda/model1.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
