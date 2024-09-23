const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = Regex.findMatch(
      headers.TESCO2.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      0,
      2,
      headers.TESCO2.headers,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.TESCO2,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > tescos > model2.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
