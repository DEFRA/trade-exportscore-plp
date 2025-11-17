const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * WARRENS2 parser implementation
 *
 * Parses WARRENS2 Excel packing lists using header matching and
 * `mapParser` then returns the combined result.
 * @module parsers/warrens/model2
 */
const { mapParser } = require("../../parser-map");
const { rowFinder } = require("../../../utilities/row-finder");
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");

/**
 * Core parse routine used by WARRENS2 and other wrappers.
 * @param {Object} packingListJson - Workbook JSON object keyed by sheet.
 * @param {Object} model - Parser model constant to include in result.
 * @param {RegExp} establishmentNumberRegex - Regex to extract establishment.
 * @returns {Object} Combined parser result.
 */
function parseModel(packingListJson, model, establishmentNumberRegex) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let establishmentNumbers = [];

    const headerTitles = Object.values(headers.WARRENS2.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    const firstValidSheet = sheets.find(
      (s) => !headers.WARRENS2.invalidSheets.includes(s),
    );

    let establishmentNumber = null;
    if (firstValidSheet) {
      establishmentNumber = regex.findMatch(
        establishmentNumberRegex,
        packingListJson[firstValidSheet],
      );
    }

    for (const sheet of sheets) {
      establishmentNumbers = regex.findAllMatches(
        regex.remosRegex,
        packingListJson[sheet],
        establishmentNumbers,
      );

      const headerRow = rowFinder(packingListJson[sheet], callback);
      const dataRow = headerRow + 1;
      if (!headers.WARRENS2.invalidSheets.includes(sheet)) {
        const mappedRows = mapParser(
          packingListJson[sheet],
          headerRow,
          dataRow,
          headers.WARRENS2,
          sheet,
        );
        packingListContents = packingListContents.concat(mappedRows);
      }
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      model,
      establishmentNumbers,
      headers.WARRENS2,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

/**
 * Wrapper parse function for WARRENS2.
 * @param {Object} packingListJson - Workbook JSON.
 * @returns {Object} Combined parser result.
 */
function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.WARRENS2,
    headers.WARRENS2.establishmentNumber.regex,
  );
}

module.exports = { parse, parseModel };
