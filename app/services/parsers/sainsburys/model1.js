const combineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const parserModel = require("../../parser-model");
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
    const establishmentNumber =
      regex
        .findMatch(
          headers.SAINSBURYS1.establishmentNumber.regex,
          packingListJson[sheets[0]],
        )
        ?.replace(/\u200B/g, "") ?? null;

    for (const sheet of sheets) {
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        0,
        1,
        headers.SAINSBURYS1.regex,
        sheet,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.SAINSBURYS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
