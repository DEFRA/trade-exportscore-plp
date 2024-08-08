const CombineParser = require("../../../parser-combine");


function parse(packingListJson) {
  const establishmentNumber = packingListJson[0].B;
  const packingListContents = packingListJson.slice(2).map((col) => ({
    description: col.B ?? null,
    nature_of_products: null,
    type_of_treatment: col.H ?? null,
    commodity_code: col.A ?? null,
    number_of_packages: col.D ?? null,
    total_net_weight_kg: col.G ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
