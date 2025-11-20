/**
 * Warrens matcher (model 1)
 *
 * Matches Warrens packing list layout using header and establishment
 * rules.
 */
const { matchesModel } = require("../fowlerwelch/model1");

/**
 * Warrens matcher (model 1)
 * @param {Object|Array} packingList - Parsed packing list input
 * @param {string} filename - Source filename for logging
 * @returns {string|Object} matcherResult - Result from delegated matchesModel
 */
function matches(packingList, filename) {
  return matchesModel(packingList, filename, /^RMS-GB-000174-\d{3}$/);
}

module.exports = { matches };
