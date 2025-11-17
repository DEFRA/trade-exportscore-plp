const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * FOWLERWELCH Excel parser - Model 1
 * @module parsers/fowlerwelch/model1
 */
const { mapParser } = require("../../parser-map");
const { rowFinder } = require("../../../utilities/row-finder");
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");
const validatorUtilities = require("../../validators/packing-list-validator-utilities");

/**
 * Core parse routine used by FowlerWelch wrappers.
 * @param {Object} packingListJson - Workbook JSON object keyed by sheet.
 * @param {Object} model - Parser model constant to include in the result.
 * @param {RegExp} establishmentNumberRegex - Regex used to find est number.
 * @returns {Object} Combined parser result.
 */
function parseModel(packingListJson, model, establishmentNumberRegex) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

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
      establishmentNumbers = regex.findAllMatches(
        regex.remosRegex,
        packingListJson[sheet],
        establishmentNumbers,
      );

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
      establishmentNumbers,
      headers.FOWLERWELCH1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

/**
 * Parse wrapper for FowlerWelch model 1.
 * @param {Object} packingListJson - Workbook JSON keyed by sheet name.
 * @returns {Object} Combined parser result.
 */
function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.FOWLERWELCH1,
    headers.FOWLERWELCH1.establishmentNumber.regex,
  );
}

module.exports = { parse, parseModel };
