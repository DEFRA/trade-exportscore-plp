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
    const establishmentNumber = regex.findMatch(
      headers.ASDA3.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    const footerValues = [/^TOTAL$/i];
    const callback = function(x) {
      return regex.testAllPatterns(footerValues, x);
    }

    for (const sheet of sheets) {
      const footerRow = rowFinder(packingListJson[sheet], callback);
      if (footerRow !== -1) {
        packingListJson[sheet] = packingListJson[sheet].slice(0, footerRow);
      }

      let headerRegex = getSheetHeaders(packingListJson[sheet]);
      const headerTitles = Object.values(headerRegex);
      const headerCallback = function (x) {
        return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
      };

      const headerRow = rowFinder(packingListJson[sheet], headerCallback);
      const dataRow = headerRow + 1;

      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headerRegex,
        sheet,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.ASDA3,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }

  function getSheetHeaders(data){
    return headers.ASDA3.regex.filter((possibleHeader) => {
      return matchesHeader(
        Object.values(possibleHeader),
        data,
      ) !== MatcherResult.WRONG_HEADER;
    })[0];
  }
}

module.exports = {
  parse,
};
