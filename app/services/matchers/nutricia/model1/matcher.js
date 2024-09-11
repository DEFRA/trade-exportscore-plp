const { matchesModel } = require("../../giovanni/model1/matcher");

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    /RMS-GB-000133/,
    "Nutricia Model 1",
  );
}

module.exports = {
  matches,
};
