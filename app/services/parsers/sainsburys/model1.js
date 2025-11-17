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
 * SAINSBURYS Excel parser - Model 1
 * @module parsers/sainsburys/model1
 */

/**
 * Parse the provided packing list JSON for SAINSBURYS model 1.
 * @param {Object} packingListJson - Workbook JSON keyed by sheet name.
 * @returns {Object} Combined parser result.
 */
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
        ?.replaceAll(/\u200B/g, "") ?? null;

    const headerTitles = Object.values(headers.SAINSBURYS1.regex);
    const headerCallback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    for (const sheet of sheets) {
      establishmentNumbers = appendDistinctEstablishmentNumbers(
        establishmentNumbers,
        packingListJson[sheet],
      );

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
      headers.SAINSBURYS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

/**
 * Find and normalise distinct establishment numbers from a page.
 * @param {Array<string>} establishmentNumbers - Existing array of RMS values.
 * @param {Array|string} page - Page content to search for RMS values.
 * @returns {Array<string>} Normalised unique RMS values.
 */
function appendDistinctEstablishmentNumbers(establishmentNumbers, page) {
  establishmentNumbers = regex.findAllMatches(
    new RegExp(/^(RMS-GB-\d{6}-\d{3})(?:\u200B)?$/),
    page,
    establishmentNumbers,
  );

  establishmentNumbers = establishmentNumbers.map((rms) =>
    rms.replaceAll(/\u200B/g, ""),
  );
  return [...new Set(establishmentNumbers)];
}

module.exports = {
  parse,
};
