const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
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
      headers.TJMORRIS1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      packingListContentsTemp = packingListJson[sheet]
        .slice(1)
        .map((col, rowPos) => ({
          description: col.N ?? null,
          nature_of_products: col.L ?? null,
          type_of_treatment: col.J ?? null,
          commodity_code: col.O ?? null,
          number_of_packages: col.P ?? null,
          total_net_weight_kg: col.R ?? null,
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

module.exports = {
  parse,
};
