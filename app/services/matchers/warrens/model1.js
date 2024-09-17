const { matchesModel } = require("../fowlerwelch/model1");
const headers = require("../../model-headers");

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    /^RMS-GB-000174-\d{3}$/,
    "Warrens",
  );
}

module.exports = { matches };
