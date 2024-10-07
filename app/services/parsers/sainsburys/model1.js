const combine_parser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const parser_model = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  const establishmentNumber =
      regex
        .findMatch(
          headers.SAINSBURYS1.establishmentNumber.regex,
          packingListJson[sheets[0]],
        )
        ?.replace(/\u200B/g, "") ?? null;

  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      0,
      1,
      headers.SAINSBURYS1.headers,
    );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.SAINSBURYS1,
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
