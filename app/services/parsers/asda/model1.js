const combine_parser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const parser_model = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  try {
    const establishmentNumber = regex.findMatch(
      headers.ASDA1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      0,
      1,
      headers.ASDA1.headers,
    );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.ASDA1,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/asda/model1.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
