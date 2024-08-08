const combineParser = require("../parser-combine");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].A ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.K ?? null,
    nature_of_products: col.I ?? null,
    type_of_treatment: null,
    commodity_code: col.L ?? null,
    number_of_packages: col.M ?? null,
    total_net_weight_kg: col.O ?? null,
  }));

  return combineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
