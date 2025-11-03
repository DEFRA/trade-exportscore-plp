const { matchesModel } = require("../warrens/model2");

function matches(packingList, filename) {
  return matchesModel(packingList, filename, /^RMS-GB-000216-\d{3}$/);
}

module.exports = { matches };
