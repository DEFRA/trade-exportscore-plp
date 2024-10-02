const { matchesModel } = require("../giovanni/model1");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  const minimumLengthThatContainsData = 22;
  return matchesModel(
    packingList,
    filename,
    headers.NUTRICIA1.establishmentNumber.regex,
    "Nutricia Model 1",
    minimumLengthThatContainsData,
  );
}

module.exports = {
  matches,
};
