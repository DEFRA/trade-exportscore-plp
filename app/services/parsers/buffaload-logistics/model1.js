const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const establishmentNumber = Regex.findMatch(
      headers.BUFFALOAD1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      1,
      2,
      headers.BUFFALOAD1.headers,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.BUFFALOAD1,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > buffaload-logistics > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
