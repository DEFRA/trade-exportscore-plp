const CombineParser = require("../parser-combine");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];

  const establishmentNumberRow = 45;

  const establishmentNumber =
    packingListJson[sheets[0]][establishmentNumberRow].M ?? null;
  for (let i = 0; i < sheets.length; i++) {
    packingListContentsTemp = packingListJson[sheets[i]]
      .slice(establishmentNumberRow)
      .map((col) => ({
        description: isNullOrEmptyOrSpace(col.F) ?? null,
        nature_of_products: null,
        type_of_treatment: isNullOrEmptyOrSpace(col.N) ?? null,
        commodity_code: isNullOrEmptyOrSpace(col.C) ?? null,
        number_of_packages: isNullOrEmptyOrSpace(col.H) ?? null,
        total_net_weight_kg: isNullOrEmptyOrSpace(col.K) ?? null,
      }));

    packingListContents = packingListContents.concat(packingListContentsTemp);
  }
  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

function isNullOrEmptyOrSpace(str) {
  if (
    (typeof str === "string" && str.length === 0) ||
    str === null ||
    (str === " " && typeof str === "string")
  ) {
    return null;
  } else {
    return str;
  }
}

module.exports = { parse, isNullOrEmptyOrSpace };
