const CombineParser = require("../../../parser-combine");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].X ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.T ?? null,
    nature_of_products: col.B ?? null,
    type_of_treatment: col.C ?? null,
    commodity_code: null,
    number_of_packages: col.F ?? null,
    total_net_weight_kg: col.G ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
