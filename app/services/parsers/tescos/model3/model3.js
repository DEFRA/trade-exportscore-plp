const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");

function parse(packingListJson) {
  const establishmentNumberRow = 3;
  const dataRow = 5;
  const establishmentNumber = packingListJson[establishmentNumberRow].E ?? null;
  const packingListContents = packingListJson.slice(dataRow).map((col) => ({
    description: col.A ?? null,
    nature_of_products: null,
    type_of_treatment: col.C ?? null,
    commodity_code: col.B ?? null,
    number_of_packages: col.E ?? null,
    total_net_weight_kg: col.G ?? null,
  }));

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TESCO3,
  );
}

module.exports = {
  parse,
};
