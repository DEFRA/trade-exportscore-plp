const combine_parser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    const establishmentNumber = regex.findMatch(
      headers.TJMORRIS1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      packingListContentsTemp = packingListJson[sheet].slice(1).map((col) => ({
        description: col.N ?? null,
        nature_of_products: col.L ?? null,
        type_of_treatment: col.J ?? null,
        commodity_code: col.O ?? null,
        number_of_packages: col.P ?? null,
        total_net_weight_kg: col.R ?? null,
      }));
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.TJMORRIS1,
    );
  } catch (err) {
    logger.logError(
      "app/services/parsers/tjmorris/model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
