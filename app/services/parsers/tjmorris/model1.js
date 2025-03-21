const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const { rowFinder } = require("../../../utilities/row-finder");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    const establishmentNumber = regex.findMatch(
      headers.TJMORRIS1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {

      // look for header row
      const headerRow = rowFinder(packingListJson[sheet], callback);

      packingListContentsTemp = packingListJson[sheet]
        .slice(headerRow + 1)
        .map((col, rowPos) => ({
          description: col.N ?? null,
          nature_of_products: col.L ?? null,
          type_of_treatment: col.J ?? null,
          commodity_code: col.O ?? null,
          number_of_packages: col.P ?? null,
          total_net_weight_kg: col.R ?? null,
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
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

function callback(x) {
  return x.R === "Net Weight Kg";
}

module.exports = {
  parse,
};
