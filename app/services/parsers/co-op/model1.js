const parser_model = require("../../parser-model");
const combine_parser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.COOP1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      0,
      1,
      headers.COOP1.headers,
    );

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.COOP1,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/co-op/model1.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
