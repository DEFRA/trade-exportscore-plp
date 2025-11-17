/**
 * Fowler-Welch matcher (model 2)
 *
 * Alternate matcher for Fowler-Welch variations that delegates to a
 * shared `matchesModel` helper. It supplies the specific establishment
 * regex for the model.
 */
const { matchesModel } = require("../warrens/model2");
const headers = require("../../model-headers");
/**
 * Fowler-Welch matcher (model 2) wrapper
 * @param {Object} packingList - Excel->JSON representation keyed by sheet
 * @param {string} filename - Source filename for logging
 * @returns {string} matcherResult - Delegated result from matchesModel
 */
function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.FOWLERWELCH2.establishmentNumber.regex,
  );
}

module.exports = { matches };
