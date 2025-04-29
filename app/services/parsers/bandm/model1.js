const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const isNullOrUndefined = (value) => value === null || value === undefined;

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];

    const establishmentNumber = regex.findMatch(
      headers.BANDM1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    const headerTitles = Object.values(headers.BANDM1.regex);
    const callback = function (x) {
      return regex.testAllPatterns(headerTitles, x);
    };
    const headerRow = rowFinder(packingListJson[sheets[0]], callback);

    for (const sheet of sheets) {
      //extracting unit from netWeight header
     const netWeightHeader = packingListJson[sheet][headerRow].G;
     const  netWeightUnit = regex.findUnit(netWeightHeader);

      const firstDataRowIndex = packingListJson[sheet]
        .slice(headerRow + 1)
        .findIndex((x) => !isEmptyRow(x));

      const dataRow =
        firstDataRowIndex === -1
          ? headerRow + 1
          : firstDataRowIndex + headerRow + 1;

      const dataRows = packingListJson[sheet].slice(dataRow + 1);
      const lastRowIndex = dataRows.findIndex((x) => isEndOfRow(x));

      const lastRow =
        lastRowIndex === -1
          ? dataRows.length + dataRow + 1
          : lastRowIndex + dataRow;

      packingListContentsTemp = packingListJson[sheet]
        .slice(dataRow, lastRow + 1)
        .map((col, rowPos) => ({
          description: col.C ?? null,
          nature_of_products: null,
          type_of_treatment: null,
          commodity_code: col.D ?? null,
          number_of_packages: col.F ?? null,
          total_net_weight_kg: col.G ?? null,
          total_net_weight_unit: netWeightUnit,
          row_location: {
            rowNumber: dataRow + rowPos + 1,
            sheetName: sheet,
          },
        }));
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BANDM1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

function isEndOfRow(x) {
  const isTotal = isTotalRow(x);
  const isEmpty = isEmptyRow(x);

  return isTotal && isEmpty;
}

function isTotalRow(x) {
  return x.F !== null && x.G !== null && x.H !== null;
}

function isEmptyRow(x) {
  return (
    isNullOrUndefined(x.A) &&
    isNullOrUndefined(x.B) &&
    isNullOrUndefined(x.C) &&
    isNullOrUndefined(x.D) &&
    isNullOrUndefined(x.E)
  );
}

module.exports = {
  parse,
  isEndOfRow,
};
