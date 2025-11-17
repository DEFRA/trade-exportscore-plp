const parserModel = require("../../parser-model");
const { parseModel } = require("../warrens/model2");
const headers = require("../../model-headers");

/**
 * FOWLERWELCH model 2 wrapper
 * @module parsers/fowlerwelch/model2
 */

/**
 * Parse wrapper delegating to shared parseModel.
 * @param {Object} packingListJson - Workbook JSON keyed by sheet name.
 * @returns {Object} Combined parser result.
 */
function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.FOWLERWELCH2,
    headers.FOWLERWELCH2.establishmentNumber.regex,
  );
}

module.exports = { parse };
