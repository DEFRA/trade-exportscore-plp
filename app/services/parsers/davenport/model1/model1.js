const ParserModel = require("../../../parser-model");
const CombineParser = require("../../../parser-combine");

function parse(packingListJson) {
  const establishmentNumberRow = 18;
  const dataRow = 45;

  const establishmentNumber = packingListJson[establishmentNumberRow].C ?? null;
  const packingListContents = packingListJson.slice(dataRow).map((col) => ({
    description: col.F ?? null,
    nature_of_products: null,
    type_of_treatment: null,
    commodity_code: col.C ?? null,
    number_of_packages: col.H ?? null,
    total_net_weight_kg: col.K ?? null,
  }));

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.DAVENPORT1,
  );
}

module.exports = {
  parse,
};
