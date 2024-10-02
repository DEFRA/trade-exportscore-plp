const { matchesModel } = require("../giovanni/model1");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  const minimumLengthThatContainsData = 22;
  return matchesModel(
    packingList,
    filename,
    headers.KEPAK1.establishmentNumber.regex,
    "Kepak Model 1",
    minimumLengthThatContainsData,
  );
}

module.exports = {
  matches,
};
