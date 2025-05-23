const { matchesModel } = require("../giovanni/model1");
const headers = require("../../model-headers");

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.NUTRICIA1.establishmentNumber.regex,
  );
}

module.exports = {
  matches,
};
