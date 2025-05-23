const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { rowFinder } = require("../../../utilities/row-finder");
const { mapParser } = require("../../parser-map");
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");
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
      headers.TESCO2.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      const headerTitles = Object.values(headers.TESCO2.regex);
      const headerCallback = function (x) {
        return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
      };

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
        if (foundKey) return foundKey;
        return Object.keys(obj).find((x) =>
          headers.TESCO3.regex.total_net_weight_kg.test(obj[x]),
        );
      }, null);

      // update value with unit
      const unit = regex.findUnit(
        packingListJson[sheet][headerRow + 1][key]?.toString(),
      );
      const packingListContentsTempUnit = packingListContentsTemp.map(
        (item) => ({
          ...item,
          total_net_weight_unit: item.total_net_weight_kg == null ? null : unit,
        }),
      );

      packingListContents = packingListContents.concat(
        packingListContentsTempUnit,
      );
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.TESCO2,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parsers()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
