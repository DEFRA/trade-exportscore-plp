const packingList = require("../models/packing-list");
const matcherResult = require("../services/matcher-result");

/**
 * Check whether the packing list is completely empty or only has headers without packing list items.
 * @param {string} packinglist - The packing list to check for valid items.
 */
function checkForPackingListItems(packinglist) {
  if (
    packinglist === null ||
    packingList === undefined ||
    packingList.length < 3
  ) {
    return matcherResult.EMPTY_FILE;
  }

  console.log(packingList.length);

  return matcherResult.CORRECT;
}

module.exports = {
  checkForPackingListItems,
};
