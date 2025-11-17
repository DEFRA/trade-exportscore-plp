/**
 * GIOVANNI Excel parser - Model 1
 * @module parsers/giovanni/model1
 */
const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");

/**
 * Parse the provided packing list JSON for GIOVANNI model 1.
 * @param {Object} packingListJson - Workbook JSON keyed by sheet name.
 * @returns {Object} Combined parser result.
 */
function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

    const headerTitles = Object.values(headers.GIOVANNI1.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    const establishmentNumber = regex.findMatch(
      headers.GIOVANNI1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      establishmentNumbers = regex.findAllMatches(
        regex.remosRegex,
        packingListJson[sheet],
        establishmentNumbers,
      );

      // Find header row for each sheet individually
      const headerRow = rowFinder(packingListJson[sheet], callback);
      const dataRow = headerRow + 1;

      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.GIOVANNI1,
        sheet,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    packingListContents = packingListContents.filter(
      (row) =>
        !(
          row.description === 0 &&
          row.commodity_code === 0 &&
          row.number_of_packages === 0 &&
          row.total_net_weight_kg === 0
        ),
    );

    packingListContents = packingListContents.filter(
      (row) =>
        !(
          row.description === null &&
          row.commodity_code === null &&
          row.number_of_packages === null &&
          row.total_net_weight_kg === null
        ),
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.GIOVANNI1,
      establishmentNumbers,
      headers.GIOVANNI1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
