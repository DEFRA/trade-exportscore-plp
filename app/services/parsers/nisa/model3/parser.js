const CombineParser = require("../../../parser-combine");

function parse(packingListJson) {
  const establishmentNumberRow = 1;
  const dataRowFirst = 3;
  const establishmentNumber = packingListJson[establishmentNumberRow].A ?? null;
  const packingListContents = packingListJson
    .slice(dataRowFirst)
    .map((col) => ({
      description: col.E ?? null,
      nature_of_products: col.C ?? null,
      type_of_treatment: null,
      commodity_code: col.F ?? null,
      number_of_packages: col.G ?? null,
      total_net_weight_kg: col.I ?? null,
    }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = {
  parse,
};
