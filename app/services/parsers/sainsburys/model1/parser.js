const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");

function parse(packingListJson) {
  console.log(packingListJson);
  const establishmentNumber =
    packingListJson[1].N?.replace(/\u200B/g, "") ?? null;
  console.log("establishmentNumber: ", establishmentNumber);
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.E ?? null,
    nature_of_products: col.C ?? null,
    type_of_treatment: null,
    commodity_code: col.O ?? null,
    number_of_packages: col.G ?? null,
    total_net_weight_kg: col.H ?? null,
  }));

  console.log("packingListContents: ", packingListContents);
  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.SAINSBURYS1,
  );
}

module.exports = {
  parse,
};
