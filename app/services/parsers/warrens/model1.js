const ParserModel = require("../../parser-model");
const { parseModel } = require("../fowlerwelch/model1");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    return parseModel(
      packingListJson,
      ParserModel.WARRENS1,
      headers.WARRENS1.establishmentNumber.regex,
    );
  } catch (err) {
    logger.log_error(
      "services > parsers > warrens > model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = { parse };
