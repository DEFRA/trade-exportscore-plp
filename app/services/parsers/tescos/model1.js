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
        headers.TESCO1.regex,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    packingListContents = packingListContents.filter(
      (row) => row.total_net_weight_kg !== 0, // Filter out rows where weight is equal to zero
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.TESCO1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
