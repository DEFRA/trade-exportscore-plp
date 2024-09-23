const combine_parser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const parser_model = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber =
      regex
        .findMatch(
          headers.SAINSBURYS1.establishmentNumber.regex,
          packingListJson,
        )
        ?.replace(/\u200B/g, "") ?? null;

    const packingListContents = mapParser(
      packingListJson,
      0,
      1,
      headers.SAINSBURYS1.headers,
    );

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.SAINSBURYS1,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > sainsburys > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
