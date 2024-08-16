const CombineParser = require("../../../parser-combine");
const MatchedModel = require("../../../matched-model");

function parse(packingListJson) {
  const traderRow = packingListJson.findIndex(
    (x) => x.H === "WAREHOUSE SCHEME NUMBER:",
  );
  const establishmentNumber = packingListJson[traderRow].I ?? null;
  const headerRow = packingListJson.findIndex((x) => x.B === "PRISM");
  const lastRow =
    packingListJson.slice(headerRow + 1).findIndex((x) => isEndOfRow(x)) +
    headerRow;
  const packingListContents = packingListJson
    .slice(headerRow + 1, lastRow + 1)
    .map((col) => ({
      description: col.C ?? null,
      nature_of_products: null,
      type_of_treatment: null,
      commodity_code: col.D ?? null,
      number_of_packages: col.F ?? null,
      total_net_weight_kg: col.G ?? null,
    }));

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    MatchedModel.BANDM1,
  );
}

function isEndOfRow(x) {
  const isTotal = x.F !== null && x.G !== null && x.H !== null;
  const isEmpty =
    x.A === " " && x.B === " " && x.C === " " && x.D === " " && x.E === " ";
  return isTotal && isEmpty;
}

module.exports = {
  parse,
};
