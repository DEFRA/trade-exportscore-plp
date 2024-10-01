const combineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const parserModel = require("../../parser-model");
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

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.SAINSBURYS1,
    );
  } catch (err) {
    logger.log_error(
      "app/services/parsers/sainsburys/model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
