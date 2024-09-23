const combine_parser = require("../../parser-combine");
const parser_model = require("../../parser-model");
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

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.TESCO1,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > tescos > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
