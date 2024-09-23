const { matchesModel } = require("../giovanni/model1");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.KEPAK1.establishmentNumber.regex,
    "Kepak Model 1",
  );
}

module.exports = {
  matches,
};
