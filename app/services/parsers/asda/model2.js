const combine_parser = require("../../parser-combine");
const parser_model = require("../../parser-model");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.ASDA2.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      0,
      1,
      headers.ASDA2.headers,
    );

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.ASDA2,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/asda/model2.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
