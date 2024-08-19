const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].B ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.L ?? null,
    nature_of_products: col.J ?? null,
    type_of_treatment: null,
    commodity_code: col.M ?? null,
    number_of_packages: col.N ?? null,
    total_net_weight_kg: col.P ?? null,
  }));

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.NISA2,
  );
}

module.exports = {
  parse,
};
