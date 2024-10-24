const parserModel = require("../../parser-model");
const combineParser = require("../../parser-combine");
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
      headers.DAVENPORT1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    const dataRow = 45;
    for (const sheet of sheets) {
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        dataRow - 1,
        dataRow,
        headers.DAVENPORT1.headers,
        false,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.DAVENPORT1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
  }
}

module.exports = {
  parse,
};
