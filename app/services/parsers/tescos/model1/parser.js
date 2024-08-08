const CombineParser = require("../parser-combine");

function parse(packingListJson) {
  const packingListContentsRow = 5;
  const establishmentNumberRow = 3;
  const establishmentNumber =
    packingListJson[establishmentNumberRow].AT ?? null;
  const packingListContents = packingListJson
    .slice(packingListContentsRow)
    .map((col) => ({
      description: col.G ?? null,
      nature_of_products: null,
      type_of_treatment: col.AS ?? null,
      commodity_code: col.L ?? null,
      number_of_packages: col.BR ?? null,
      total_net_weight_kg: col.BU ?? null,
    }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
