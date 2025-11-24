/**
 * BOOTS Excel parser - Model 1
 * @module parsers/boots/model1
 */
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
 * Parse the provided packing list JSON for BOOTS model 1.
 * @param {Object} packingListJson - Workbook JSON keyed by sheet name.
 * @returns {Object} Combined parser result.
 */
function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  const establishmentNumber = regex.findMatch(
    headers.BOOTS1.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  try {
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

    const headerTitles = Object.values(headers.BOOTS1.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    for (const sheet of sheets) {
      establishmentNumbers = regex.findAllMatches(
        regex.remosRegex,
        packingListJson[sheet],
        establishmentNumbers,
      );

      const headerRow = rowFinder(packingListJson[sheet], callback);
      const dataRow = headerRow + 1;

      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.BOOTS1,
        sheet,
      );

      const footerValues = new Set([
        "Total Quantity of items:",
        "Gross Mass in Kgs:",
        "Total Value in GBP:",
      ]);
      packingListContents = packingListContents.concat(
        packingListContentsTemp.filter(
          (row) => !footerValues.has(row.description),
        ),
      );
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BOOTS1,
      establishmentNumbers,
      headers.BOOTS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(
      establishmentNumber,
      [],
      false,
      parserModel.BOOTS1,
      [],
      headers.BOOTS1,
    );
  }
}

module.exports = {
  parse,
};
