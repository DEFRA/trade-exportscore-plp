const combine_parser = require("../../parser-combine");
const parser_model = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const matcherResult = require("../../matcher-result");
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
      return matcherResult.WRONG_HEADER;
    }

    const establishmentNumber = regex.findMatch(
      headers.GIOVANNI1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      headerRow,
      headerRow + 1,
      headers.GIOVANNI1.headers,
    );

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.GIOVANNI1,
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
