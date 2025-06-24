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
      headers.TESCO1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      const headerTitles = Object.values(headers.TESCO1.regex);
      const headerCallback = function (x) {
        return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
      };

      const headerRow = rowFinder(packingListJson[sheets[0]], headerCallback);
      const dataRow = headerRow + 1;
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.TESCO1,
        sheet,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    packingListContents = packingListContents.filter(
      (row) =>
        !(
          row.description === null &&
          row.commodity_code === null &&
          row.number_of_packages === null &&
          (row.total_net_weight_kg === 0 || row.total_net_weight_kg === null) &&
          row.type_of_treatment === "Ambient"
        ),
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.TESCO1,
      [],
      headers.TESCO1.findUnitInHeader,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

module.exports = {
  parse,
};
