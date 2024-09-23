const parser_model = require("../../parser-model");
const combine_parser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const matcher_result = require("../../matcher-result");
const { rowFinder } = require("../../../utilities/row-finder");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.NUTRICIA1.establishmentNumber.regex,
      packingListJson,
    );

    const headerTitles = Object.values(headers.NUTRICIA1.headers);
    function callback(x) {
      return Object.values(x).includes(headerTitles[0]);
    }
    const headerRow = rowFinder(packingListJson, callback);
    if (!packingListJson[headerRow] || headerRow === -1) {
      return matcher_result.WRONG_HEADER;
    }
    const dataRow = headerRow + 1;
    const packingListContents = mapParser(
      packingListJson,
      headerRow,
      dataRow,
      headers.NUTRICIA1.headers,
    );

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.NUTRICIA1,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > nutrica > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
