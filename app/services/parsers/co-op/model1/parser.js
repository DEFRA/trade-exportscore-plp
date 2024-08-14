const CombineParser = require("../../../parser-combine");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].E ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.O ?? null,
    nature_of_products: col.P ?? null,
    commodity_code: null,
    number_of_packages: col.Q ?? null,
    total_net_weight_kg: col.S ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
