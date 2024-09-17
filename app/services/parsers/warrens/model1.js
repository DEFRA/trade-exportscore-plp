const ParserModel = require("../../parser-model");
const { parseModel } = require("../fowlerwelch/model1");

function parse(packingListJson) {
  try {
    return parseModel(packingListJson, ParserModel.WARRENS1);
  } catch (err) {
    console.error(
      `${ParserModel.WARRENS1} encountered: ${err} when parsing model`,
    );
  }
}

module.exports = { parse };
