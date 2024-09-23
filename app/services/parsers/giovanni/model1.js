const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");
const MatcherResult = require("../../matcher-result");
const { rowFinder } = require("../../../utilities/row-finder");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const headerTitles = Object.values(headers.GIOVANNI1.headers);
    function callback(x) {
      return Object.values(x).includes(headerTitles[0]);
    }
    const headerRow = rowFinder(packingListJson, callback);
    if (!packingListJson[headerRow] || headerRow === -1) {
      return MatcherResult.WRONG_HEADER;
    }

    const establishmentNumber = Regex.findMatch(
      headers.GIOVANNI1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      headerRow,
      headerRow + 1,
      headers.GIOVANNI1.headers,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.GIOVANNI1,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > giovanni > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
