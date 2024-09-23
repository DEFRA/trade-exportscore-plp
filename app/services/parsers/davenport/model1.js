const parser_model = require("../../parser-model");
const combine_parser = require("../../parser-combine");
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

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.DAVENPORT1,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > davenport > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
