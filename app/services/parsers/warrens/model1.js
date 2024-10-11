const parserModel = require("../../parser-model");
const { parseModel } = require("../fowlerwelch/model1");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    return parseModel(
      packingListJson,
      parserModel.WARRENS1,
      headers.WARRENS1.establishmentNumber.regex,
    );
  } catch (err) {
    logger.logError("app/services/parsers/warrens/model1.js", "matches()", err);
  }
}

module.exports = { parse };
