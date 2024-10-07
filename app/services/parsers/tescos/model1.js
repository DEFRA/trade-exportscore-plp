const combine_parser = require("../../parser-combine");
const parser_model = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  const establishmentNumber = regex.findMatch(
      headers.TESCO1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    const packingListContentsRow = 5;
  
  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
        packingListJson[sheet],
        packingListContentsRow - 1,
        packingListContentsRow,
        headers.TESCO1.headers,
      );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }
    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.TESCO1,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/tescos/model1.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
