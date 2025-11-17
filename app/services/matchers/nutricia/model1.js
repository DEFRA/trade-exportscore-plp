/**
 * Nutricia matcher (model 1)
 *
 * Matches Nutricia Excel layouts by verifying establishment regex
 * and header content.
 */
const matcherResult = require("../../matcher-result");
const { matchesModel } = require("../giovanni/model1");
const headers = require("../../model-headers");

/**
 * Check whether the provided packing list matches Nutricia Model 1.
 * @param {Object} packingList - Excel->JSON representation keyed by sheet
 * @param {string} filename - Source filename for logging
 * @returns {string} - One of matcherResult codes
 */
function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.NUTRICIA1.establishmentNumber.regex,
  );
}

module.exports = {
  matches,
};
