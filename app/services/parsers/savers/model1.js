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
  const sheets = Object.keys(packingListJson);
  const establishmentNumber = regex.findMatch(
    headers.SAVERS1.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  try {
    let packingListContents = [];
    let packingListContentsTemp = [];

    const headerTitles = Object.values(headers.SAVERS1.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    const headerRow = rowFinder(packingListJson[sheets[0]], callback);
    const dataRow = headerRow + 1;

    for (const sheet of sheets) {
      if (!headers.SAVERS1.invalidSheets.includes(sheet)) {
        packingListContentsTemp = mapParser(
          packingListJson[sheet],
          headerRow,
          dataRow,
          headers.SAVERS1,
          sheet,
        );

        packingListContents = packingListContents.concat(
          packingListContentsTemp.filter(
            (row) =>
              !(
                row.description === 0 &&
                row.number_of_packages === 0 &&
                row.total_net_weight_kg === 0
              ),
          ),
        );
      }
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.SAVERS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(
      establishmentNumber,
      [],
      false,
      parserModel.SAVERS1,
    );
  }
}

module.exports = {
  parse,
};
