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
    const headerTitles = Object.values(headers.FOWLERWELCH1.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };
    const establishmentNumber = regex.findMatch(
      establishmentNumberRegex,
      packingListJson[sheets[0]],
    );

    const notDragDownCallback = function (item) {
      return !(
        validatorUtilities.hasMissingDescription(item) &&
        validatorUtilities.hasMissingIdentifier(item) &&
        validatorUtilities.hasMissingPackages(item) &&
        validatorUtilities.hasMissingNetWeight(item)
      );
    };

    for (const sheet of sheets) {
      const headerRow = rowFinder(packingListJson[sheet], callback);
      const dataRow = headerRow + 1;
      if (!headers.FOWLERWELCH1.invalidSheets.includes(sheet)) {
        packingListContentsTemp = mapParser(
          packingListJson[sheet],
          headerRow,
          dataRow,
          headers.FOWLERWELCH1,
          sheet,
        );

        packingListContentsTemp =
          packingListContentsTemp.filter(notDragDownCallback);

        packingListContents = packingListContents.concat(
          packingListContentsTemp,
        );
      }
    }
    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      model,
      headers.FOWLERWELCH1.findUnitInHeader,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.FOWLERWELCH1,
    headers.FOWLERWELCH1.establishmentNumber.regex,
  );
}

module.exports = { parse, parseModel };
