const { matchesModel } = require("../fowlerwelch/model1");

function matches(packingList, filename) {
  return matchesModel(packingList, filename, /^RMS-GB-000174-\d{3}$/);
}

module.exports = { matches };
