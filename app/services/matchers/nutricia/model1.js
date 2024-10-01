const { matchesModel } = require("../giovanni/model1");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.NUTRICIA1.establishmentNumber.regex,
    "Nutricia Model 1",
    22,
  );
}

module.exports = {
  matches,
};
