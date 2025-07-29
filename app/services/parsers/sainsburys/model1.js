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
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];
    const establishmentNumber =
      regex
        .findMatch(
          headers.SAINSBURYS1.establishmentNumber.regex,
          packingListJson[sheets[0]],
        )
        ?.replace(/\u200B/g, "") ?? null;

    for (const sheet of sheets) {
      establishmentNumbers = appendDistinctEstablishmentNumbers(
        establishmentNumbers,
        packingListJson[sheet],
      );

      const headerTitles = Object.values(headers.SAINSBURYS1.regex);
      const headerCallback = function (x) {
        return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
      };

      const headerRow = rowFinder(packingListJson[sheets[0]], headerCallback);
      const dataRow = headerRow + 1;
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.SAINSBURYS1,
        sheet,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.SAINSBURYS1,
      establishmentNumbers,
      headers.SAINSBURYS1.findUnitInHeader,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

function appendDistinctEstablishmentNumbers(establishmentNumbers, page) {
  establishmentNumbers = regex.findAllMatches(
    new RegExp(/^RMS-GB-\d{6}-\d{3}(?:\u200B)?$/),
    page,
    establishmentNumbers,
  );

  establishmentNumbers = establishmentNumbers.map((rms) =>
    rms.replace(/\u200B/g, ""),
  );
  return [...new Set(establishmentNumbers)];
}

module.exports = {
  parse,
};
