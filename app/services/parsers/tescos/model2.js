/**
 * TESCOS Excel parser - Model 2
 * @module parsers/tescos/model2
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

function isNotEmptyRow(row) {
  const ignoreColumns = new Set(["total_net_weight_unit", "row_location"]);
  return Object.keys(row)
    .filter((k) => !ignoreColumns.has(k))
    .some((k) => row[k]);
}

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

    const establishmentNumber = regex.findMatch(
      headers.TESCO2.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    const headerTitles = Object.values(headers.TESCO2.regex);
    const headerCallback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    for (const sheet of sheets) {
      establishmentNumbers = regex.findAllMatches(
        regex.remosRegex,
        packingListJson[sheet],
        establishmentNumbers,
      );

      const headerRow = rowFinder(packingListJson[sheet], headerCallback);

      const dataRow = headerRow + 2;
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.TESCO2,
        sheet,
      );

      // find net weight column
      const key = packingListJson[sheet].reduce((foundKey, obj) => {
        if (foundKey) {
          return foundKey;
        }
        return Object.keys(obj).find((x) =>
          headers.TESCO2.regex.total_net_weight_kg.test(obj[x]),
        );
      }, null);

      // update value with unit
      const unit = regex.findUnit(
        packingListJson[sheet][headerRow + 1][key]?.toString(),
      );
      const packingListContentsTempUnit = packingListContentsTemp
        .filter(isNotEmptyRow)
        .map((item) => ({
          ...item,
          total_net_weight_unit: unit,
        }));

      packingListContents = packingListContents.concat(
        packingListContentsTempUnit,
      );
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.TESCO2,
      establishmentNumbers,
      headers.TESCO2,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parsers()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
