const CombineParser = require("../parser-combine");

function parse(packingListJson) {
  const establishmentNumberRow = 45;
  const establishmentNumber = packingListJson[establishmentNumberRow].M ?? null;
  const packingListContents = packingListJson
    .slice(establishmentNumberRow)
    .map((col) => ({
      description: col.F ?? null,
      nature_of_products: null,
      type_of_treatment: col.N ?? null,
      commodity_code: col.C ?? null,
      number_of_packages: col.H ?? null,
      total_net_weight_kg: col.K ?? null,
    }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
