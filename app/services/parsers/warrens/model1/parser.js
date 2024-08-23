const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];

  let headerRow = packingListJson[sheets[0]].findIndex(
    (x) => x.M === "NIIRMS Dispatch number",
  );

  const establishmentNumber =
    packingListJson[sheets[0]][headerRow + 1].M ?? null;

  for (let i = 0; i < sheets.length; i++) {
    headerRow = packingListJson[sheets[i]].findIndex(
      (x) => x.M === "NIIRMS Dispatch number",
    );

    packingListContentsTemp = packingListJson[sheets[i]]
      .slice(headerRow + 1)
      .map((col) => ({
        description: col.F ?? null,
        nature_of_products: null,
        type_of_treatment: col.N ?? null,
        commodity_code: col.C ?? null,
        number_of_packages: col.H ?? null,
        total_net_weight_kg: col.K ?? null,
      }));

    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.WARRENS1,
  );
}

module.exports = { parse };
