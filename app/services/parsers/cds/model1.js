const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = Regex.findMatch(
      headers.CDS1.establishmentNumber.regex,
      packingListJson,
    );

    const dataRow = 1;
    const packingListContents = mapParser(
      packingListJson,
      dataRow - 1,
      dataRow,
      headers.CDS1.headers,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.CDS1,
    );
  } catch (err) {
    logger.log_error("services > parsers > cds > model1.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
