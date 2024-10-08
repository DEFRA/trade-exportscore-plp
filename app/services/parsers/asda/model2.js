const combine_parser = require("../../parser-combine");
const parser_model = require("../../parser-model");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    const establishmentNumber = regex.findMatch(
      headers.ASDA2.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        0,
        1,
        headers.ASDA2.headers,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

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
