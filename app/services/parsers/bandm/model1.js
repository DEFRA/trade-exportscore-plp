const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { mapParser } = require("../../parser-map");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

    const establishmentNumber = regex.findMatch(
      headers.BANDM1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    const headerTitles = Object.values(headers.BANDM1.regex);
    const callback = function (x) {
      return regex.testAllPatterns(headerTitles, x);
    };
    const headerRow = rowFinder(packingListJson[sheets[0]], callback);
    const dataRow = headerRow + 1;

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
        headers.BANDM1,
        sheet,
      );

      const totalsIndex = packingListContentsTemp.findLastIndex(
        (row) =>
          row.description === null &&
          row.commodity_code === null &&
          row.country_of_origin === null &&
          row.number_of_packages !== 0 &&
          row.total_net_weight_kg !== 0,
      );
      if (totalsIndex === packingListContentsTemp.length - 1) {
        packingListContentsTemp = packingListContentsTemp.slice(0, totalsIndex);
      }
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BANDM1,
      establishmentNumbers,
      headers.BANDM1.findUnitInHeader,
      headers.BANDM1.validateCountryOfOrigin,
      true,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
