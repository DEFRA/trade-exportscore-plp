const CombineParser = require("../../../parser-combine");
const MatchedModel = require("../../../matched-model");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].A ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.K ?? null,
    nature_of_products: col.I ?? null,
    type_of_treatment: null,
    commodity_code: col.L ?? null,
    number_of_packages: col.M ?? null,
    total_net_weight_kg: col.O ?? null,
  }));

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    MatchedModel.NISA1,
  );
}

module.exports = {
  parse,
};
