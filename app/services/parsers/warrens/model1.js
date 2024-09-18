const ParserModel = require("../../parser-model");
const { parseModel } = require("../fowlerwelch/model1");
const headers = require("../../model-headers");

function parse(packingListJson) {
  return parseModel(
    packingListJson,
    ParserModel.WARRENS1,
    headers.WARRENS1.establishmentNumber.regex,
  );
}

module.exports = { parse };
