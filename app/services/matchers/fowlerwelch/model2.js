const { matchesModel } = require("../warrens/model2");
const headers = require("../../model-headers");
function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.FOWLERWELCH2.establishmentNumber.regex,
  );
}

module.exports = { matches };
