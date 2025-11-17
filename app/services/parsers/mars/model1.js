const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * MARS Excel parser - Model 1
 * @module parsers/mars/model1
 */

/**
 * Parse the provided packing list JSON for MARS model 1.
 * @param {Object} packingListJson - Workbook JSON keyed by sheet name.
 * @returns {Object} Combined parser result.
 */
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

    const headerTitles = Object.values(headers.MARS1.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };
    const headerRow = rowFinder(packingListJson[sheets[0]], callback);
    const dataRow = headerRow + 1;

    const establishmentNumber = regex.findMatch(
      headers.MARS1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      establishmentNumbers = regex.findAllMatches(
        regex.remosRegex,
        packingListJson[sheet],
        establishmentNumbers,
      );

      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.MARS1,
        sheet,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.MARS1,
      establishmentNumbers,
      headers.MARS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
