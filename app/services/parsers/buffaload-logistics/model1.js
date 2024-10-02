const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.BUFFALOAD1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = mapParser(
      packingListJson,
      1,
      2,
      headers.BUFFALOAD1.headers,
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BUFFALOAD1,
    );
  } catch (err) {
    logger.log_error(filenameForLogging, "matches()", err);
  }
}

module.exports = {
  parse,
};
