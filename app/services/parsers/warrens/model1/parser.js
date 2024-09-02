const ParserModel = require("../../../parser-model");
const { parseModel } = require("../../fowlerwelch/model1/parser");

function parse(packingListJson) {
  return parseModel(packingListJson, ParserModel.WARRENS1)
}

module.exports = { parse };
