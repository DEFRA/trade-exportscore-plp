const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function parse(packingListJson) {
  try {
    const establishmentNumber = regex.findMatch(
      headers.TJMORRIS1.establishmentNumber.regex,
      packingListJson,
    );

    const packingListContents = packingListJson.slice(1).map((col) => ({
      description: col.N ?? null,
      nature_of_products: col.L ?? null,
      type_of_treatment: col.J ?? null,
      commodity_code: col.O ?? null,
      number_of_packages: col.P ?? null,
      total_net_weight_kg: col.R ?? null,
    }));

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.TJMORRIS1,
    );
  } catch (err) {
    logger.log_error(filenameForLogging, "matches()", err);
  }
}

module.exports = {
  parse,
};
