const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    const headerTitles = Object.values(headers.GIOVANNI1.regex);
    const callback = function (x) {
      if (matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT) {
        return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
      }
    };
    const headerRow = rowFinder(packingListJson[sheets[0]], callback);
    const dataRow = headerRow + 1;

    const establishmentNumber = regex.findMatch(
      headers.GIOVANNI1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.GIOVANNI1.regex,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.GIOVANNI1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
  }
}

module.exports = {
  parse,
};
