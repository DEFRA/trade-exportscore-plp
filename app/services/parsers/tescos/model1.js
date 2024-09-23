const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = Regex.findMatch(
      headers.TESCO1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContentsRow = 5;
    const packingListContents = mapParser(
      packingListJson,
      packingListContentsRow - 1,
      packingListContentsRow,
      headers.TESCO1.headers,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.TESCO1,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > tescos > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
