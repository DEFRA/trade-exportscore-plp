/**
 * Kepak matcher
 *
 * Delegates to a shared Giovanni-based matcher helper while supplying
 * Kepak-specific establishment number regex.
 */
const { matchesModel } = require("../giovanni/model1");
const headers = require("../../model-headers");

/**
 * Kepak matcher
 * @param {Object} packingList - Parsed packing list input
 * @param {string} filename - Source filename for logging
 * @returns {string|Object} matcherResult - Delegated result from matchesModel
 */
function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.KEPAK1.establishmentNumber.regex,
  );
}

module.exports = {
  matches,
};
