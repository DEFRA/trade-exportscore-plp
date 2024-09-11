const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");

function parse(packingListJson) {
  const establishmentNumberRow =
    packingListJson.findIndex((x) => x.A === "NIRMS NUMBER") + 1;
  const headerRow = packingListJson.findIndex((x) => x.C === "DESCRIPTION");
  const dataRow = headerRow + 1;

  const establishmentNumber = packingListJson[establishmentNumberRow].A ?? null;
  const packingListContents = packingListJson.slice(dataRow).map((col) => ({
    description: col.C ?? null,
    nature_of_products: null,
    type_of_treatment: null,
    commodity_code: col.E ?? null,
    number_of_packages: col.G ?? null,
    total_net_weight_kg: col.H ?? null,
  }));

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.NUTRICIA1,
  );
}

module.exports = {
  parse,
};