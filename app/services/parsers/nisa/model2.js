const combine_parser = require("../../parser-combine");
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
    const establishmentNumber = regex.findMatch(
      headers.NISA2.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    const dataRowFirst = 3;

    for (const sheet of sheets) {
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        dataRowFirst - 1,
        dataRowFirst,
        headers.NISA2.headers,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.NISA2,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
  }
}

module.exports = {
  parse,
};
