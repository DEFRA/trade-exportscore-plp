const ParserModel = require("../../../parser-model");
const CombineParser = require("../../../parser-combine");

function parse(packingListJson) {
  const establishmentNumberRow = 1;
  const dataRow = 1;

  const placeOfDispatchSplit =
    packingListJson[establishmentNumberRow].K?.split("/") ?? [];
  const establishmentNumber =
    placeOfDispatchSplit.length > 1 ? placeOfDispatchSplit[1].trim() : null;
  const packingListContents = packingListJson.slice(dataRow).map((col) => ({
    description: col.D ?? null,
    nature_of_products: col.I ?? null,
    type_of_treatment: col.J ?? null,
    commodity_code: null,
    number_of_packages: col.E ?? null,
    total_net_weight_kg: col.H ?? null,
  }));

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.CDS1,
  );
}

module.exports = {
  parse,
};
