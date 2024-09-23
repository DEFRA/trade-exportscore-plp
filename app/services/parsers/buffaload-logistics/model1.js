const combine_parser = require("../../parser-combine");
const parser_model = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.BUFFALOAD1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      1,
      2,
      headers.BUFFALOAD1.headers,
    );

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.BUFFALOAD1,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > buffaload-logistics > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
