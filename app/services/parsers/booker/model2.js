const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { rowFinder } = require("../../../utilities/row-finder");
const { mapParser } = require("../../parser-map");
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * BOOKER Excel parser - Model 2
 * @module parsers/booker/model2
 */

/**
 * Parse the provided packing list JSON for BOOKER model 2.
 * @param {Object} packingListJson - Workbook JSON keyed by sheet name.
 * @returns {Object} Combined parser result.
 */
function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

    const establishmentNumber = regex.findMatch(
      headers.BOOKER2.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    const headerTitles = Object.values(headers.BOOKER2.regex);
    const headerCallback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    const footerValues = [/^TOTALS$/i];
    const callback = function (x) {
      return regex.testAllPatterns(footerValues, x);
    };

    for (const sheet of sheets) {
      establishmentNumbers = regex.findAllMatches(
        /RMS-GB-\d{6}-\d{3}/i,
        packingListJson[sheet],
        establishmentNumbers,
      );

      const footerRow = rowFinder(packingListJson[sheet], callback);
      if (footerRow !== -1) {
        packingListJson[sheet] = packingListJson[sheet].slice(0, footerRow);
      }

      const headerRow = rowFinder(packingListJson[sheets[0]], headerCallback);
      const dataRow = headerRow + 1;

      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.BOOKER2,
        sheet,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BOOKER2,
      establishmentNumbers,
      headers.BOOKER2,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH, []);
  }
}

module.exports = {
  parse,
};
