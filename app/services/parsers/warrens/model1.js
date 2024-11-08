const parserModel = require("../../parser-model");
const { parseModel } = require("../fowlerwelch/model1");
const headers = require("../../model-headers");

function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.WARRENS1,
    headers.WARRENS1.establishmentNumber.regex,
  );
}

module.exports = { parse };
