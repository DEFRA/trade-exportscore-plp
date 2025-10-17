const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { mapParser } = require("../../parser-map");
const { rowFinder } = require("../../../utilities/row-finder");
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");
const validatorUtilities = require("../../validators/packing-list-validator-utilities");

function parseModel(packingListJson, model, establishmentNumberRegex) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

    const headerTitles = Object.values(headers.WARRENS2.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    const firstValidSheet = sheets.find(
      (s) => !headers.WARRENS2.invalidSheets.includes(s),
    );

    const establishmentNumber = firstValidSheet
      ? regex.findMatch(establishmentNumberRegex, packingListJson[firstValidSheet])
      : regex.findMatch(establishmentNumberRegex, packingListJson[sheets[0]]);
      
    for (const sheet of sheets) {
      establishmentNumbers = regex.findAllMatches(
        regex.remosRegex,
        packingListJson[sheet],
        establishmentNumbers,
      );

      const headerRow = rowFinder(packingListJson[sheet], callback);
      const dataRow = headerRow + 1;
      if (!headers.WARRENS2.invalidSheets.includes(sheet)) {
        packingListContents = mapParser(
          packingListJson[sheet],
          headerRow,
          dataRow,
          headers.WARRENS2,
          sheet,
        );
      }
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      model,
      establishmentNumbers,
      headers.WARRENS2,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.WARRENS2,
    headers.WARRENS2.establishmentNumber.regex,
  );
}

module.exports = { parse, parseModel };
