const CombineParser = require("../parser-combine");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].A ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.N ?? null,
    nature_of_products: col.L ?? null,
    type_of_treatment: col.J ?? null,
    commodity_code: col.O ?? null,
    number_of_packages: col.P ?? null,
    total_net_weight_kg: col.R ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
