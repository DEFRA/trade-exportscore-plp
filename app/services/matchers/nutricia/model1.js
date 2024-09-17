const { matchesModel } = require("../giovanni/model1");

function matches(packingList, filename) {
  return matchesModel(packingList, /RMS-GB-000133/);
}

module.exports = {
  matches,
};
