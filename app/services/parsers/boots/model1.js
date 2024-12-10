const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { rowFinder } = require("../../../utilities/row-finder");
const { mapParser } = require("../../parser-map");
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function parse(packingListJson) {

  const sheets = Object.keys(packingListJson);
  const establishmentNumber = regex.findMatch(
    headers.BOOTS1.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  try {
    let packingListContents = [];
    let packingListContentsTemp = [];

    const headerTitles = Object.values(headers.BOOTS1.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    const headerRow = rowFinder(packingListJson[sheets[0]], callback);
    const dataRow = headerRow + 1;

    for (const sheet of sheets) {
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.BOOTS1.regex,
      );

      const footerValues = ['Total Quantity of items:', 'Gross Mass in Kgs:', 'Total Value in GBP:'];
      packingListContents = packingListContents.concat(packingListContentsTemp.filter((row) => !footerValues.includes(row.description)));
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BOOTS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(establishmentNumber, [], false, parserModel.BOOTS1);
  }
}

module.exports = {
  parse,
};
