const parser_model = require("../../parser-model");
const combine_parser = require("../../parser-combine");
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
      headers.KEPAK1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

  const dataRow = 21;

  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      dataRow - 1,
      dataRow,
      headers.KEPAK1.headers,
    );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.KEPAK1,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/kepak/model1.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
