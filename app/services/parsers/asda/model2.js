const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

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

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.ASDA2,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
  }
}

module.exports = {
  parse,
};
