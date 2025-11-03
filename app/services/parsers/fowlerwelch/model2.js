const parserModel = require("../../parser-model");
const { parseModel } = require("../warrens/model2");
const headers = require("../../model-headers");

function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.FOWLERWELCH2,
    headers.FOWLERWELCH2.establishmentNumber.regex,
  );
}

module.exports = { parse };
