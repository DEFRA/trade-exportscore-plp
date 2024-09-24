const combine_parser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const parser_model = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
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

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.NISA2,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/nisa/model2.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
