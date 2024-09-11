const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");

function parse(packingListJson) {
  const headerRow = packingListJson.findIndex((x) => x.C === "DESCRIPTION");
  const establishmentNumberRow = packingListJson.findIndex(
    (x) => x.A === "NIRMS NUMBER",
  );
  const establishmentNumber =
    packingListJson[establishmentNumberRow + 1].A ?? null;
  const packingListContents = packingListJson
    .slice(headerRow + 1)
    .map((col) => ({
      description: col.C ?? null,
      number_of_packages: col.G ?? null,
      total_net_weight_kg: col.H ?? null,
      commodity_code: col.E ?? null,
    }));

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.GIOVANNI1,
  );
}

module.exports = {
  parse,
};
