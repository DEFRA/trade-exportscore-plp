const validatorUtilities = require("../../validators/packing-list-validator-utilities");

/**
 * NISA utility helpers
 * @module parsers/nisa/utilities
 */

/**
 * Return true when the item appears to be a totals row.
 * @param {Object} item - Row item to test.
 * @returns {boolean}
 */
function isTotalRow(item) {
  return (
    validatorUtilities.hasMissingDescription(item) &&
    validatorUtilities.hasMissingIdentifier(item) &&
    !validatorUtilities.hasMissingNetWeight(item) &&
    !validatorUtilities.hasMissingPackages(item)
  );
}

module.exports = {
  isTotalRow,
};
