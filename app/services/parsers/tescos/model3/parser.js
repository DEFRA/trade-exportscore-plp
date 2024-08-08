const CombineParser = require("../../../parser-combine");


function parse(packingListJson) {
  const establishmentNumber = packingListJson[3].E ?? null;
  const packingListContents = packingListJson.slice(5).map((col) => ({
    description: col.A ?? null,
    nature_of_products: null,
    type_of_treatment: col.C ?? null,
    commodity_code: col.B ?? null,
    number_of_packages: col.E ?? null,
    total_net_weight_kg: col.G ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
