const CombineParser = require("../parser-combine");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[2].M ?? null;
  const packingListContents = packingListJson.slice(2).map((col) => ({
    description: col.F ?? null,
    nature_of_products: null,
    type_of_treatment: null,
    commodity_code: col.C ?? null,
    number_of_packages: col.H ?? null,
    total_net_weight_kg: col.K ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
