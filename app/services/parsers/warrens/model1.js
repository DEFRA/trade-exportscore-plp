const parserModel = require("../../parser-model");
const { parseModel } = require("../fowlerwelch/model1");
const headers = require("../../model-headers");

/**
 * WARRENS1 parser wrapper
 *
 * Delegates to `fowlerwelch/model1.parseModel` with the WARRENS1 model.
 * @module parsers/warrens/model1
 */

/**
 * Parse the provided packing list JSON for WARRENS1.
 * @param {Object} packingListJson - Workbook JSON.
 * @returns {Object} Combined parser result.
 */
function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.WARRENS1,
    headers.WARRENS1.establishmentNumber.regex,
  );
}

module.exports = { parse };
