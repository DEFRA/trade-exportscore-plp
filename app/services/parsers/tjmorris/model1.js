const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const { rowFinder } = require("../../../utilities/row-finder");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * TJMORRIS Excel parser - Model 1
 * @module parsers/tjmorris/model1
 */

/**
 * Parse the provided packing list JSON for TJMORRIS model 1.
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
      headers.TJMORRIS1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      establishmentNumbers = regex.findAllMatches(
        regex.remosRegex,
        packingListJson[sheet],
        establishmentNumbers,
      );

      // look for header row
      const headerRow = rowFinder(packingListJson[sheet], callback);

      //extracting unit from netWeight header
      const netWeightHeader = packingListJson[sheet][headerRow].R;
      const netWeightUnit = regex.findUnit(netWeightHeader);

      packingListContentsTemp = packingListJson[sheet]
        .slice(headerRow + 1)
        .map((col, rowPos) => ({
          description: col.N ?? null,
          nature_of_products: col.L ?? null,
          type_of_treatment: col.J ?? null,
          commodity_code: col.O ?? null,
          number_of_packages: col.P ?? null,
          total_net_weight_kg: col.R ?? null,
          total_net_weight_unit: (isNotEmpty(col) && netWeightUnit) ?? null,
          country_of_origin: col.T ?? null,
          row_location: {
            rowNumber: rowPos + 2,
            sheetName: sheet,
          },
        }));
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.TJMORRIS1,
      establishmentNumbers,
      headers.TJMORRIS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

/**
 * Return true when the column contains any of the expected fields.
 * @param {Object} col - Column object from the sheet row.
 * @returns {boolean}
 */
function isNotEmpty(col) {
  return (
    col.J || //"TREATMENTTYPE"
    col.L || //"Description"
    col.N || //"Description"
    col.O || //"Tariff/Commodity"
    col.P || //"Cases"
    col.R //"Net Weight"
  );
}

/**
 * Header callback that checks for the net weight header in column R.
 * @param {Object} x - Row object to check.
 * @returns {boolean}
 */
function callback(x) {
  return x.R?.toLowerCase().includes("net weight");
}

module.exports = {
  parse,
};
