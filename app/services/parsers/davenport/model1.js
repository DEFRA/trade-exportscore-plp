const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = Regex.findMatch(
      headers.DAVENPORT1.establishmentNumber.regex,
      packingListJson,
    );

    const dataRow = 45;
    const packingListContents = mapParser(
      packingListJson,
      dataRow - 1,
      dataRow,
      headers.DAVENPORT1.headers,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.DAVENPORT1,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > davenport > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
