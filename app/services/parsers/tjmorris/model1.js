const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
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

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TJMORRIS1,
  );
}

module.exports = {
  parse,
};
