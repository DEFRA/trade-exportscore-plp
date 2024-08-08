const CombineParser = require("../../../parser-combine");


function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].H ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.B ?? null,
    nature_of_products: col.D ?? null,
    type_of_treatment: col.F ?? null,
    commodity_code: null,
    number_of_packages: col.J ?? null,
    total_net_weight_kg: col.N ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
