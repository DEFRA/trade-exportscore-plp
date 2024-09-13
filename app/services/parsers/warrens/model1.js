const ParserModel = require("../../parser-model");
const { parseModel } = require("../fowlerwelch/model1");

function parse(packingListJson) {
  return parseModel(packingListJson, ParserModel.WARRENS1);
}

module.exports = { parse };
