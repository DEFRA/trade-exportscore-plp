const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = Regex.findMatch(
      headers.NISA2.establishmentNumber.regex,
      packingListJson,
    );

    const dataRowFirst = 3;
    const packingListContents = mapParser(
      packingListJson,
      dataRowFirst - 1,
      dataRowFirst,
      headers.NISA2.headers,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.NISA2,
    );
  } catch (err) {
    logger.log_error("services > parsers > nisa > model2.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
