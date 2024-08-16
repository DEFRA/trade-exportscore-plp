const CombineParser = require("../../../parser-combine");
const MatchedModel = require("../../../matched-model");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].D ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.A ?? null,
    nature_of_products: col.B ?? null,
    type_of_treatment: col.C ?? null,
    commodity_code: null,
    number_of_packages: col.F ?? null,
    total_net_weight_kg: col.G ?? null,
  }));

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    MatchedModel.ASDA1,
  );
}

module.exports = {
  parse,
};
