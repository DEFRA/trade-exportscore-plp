const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parseModel(packingListJson, model, establishmentNumberRegex) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];

  let headerRow = packingListJson[sheets[0]].findIndex(
    (x) => x.M === "NIIRMS Dispatch number",
  );

  const establishmentNumber = Regex.findMatch(
    establishmentNumberRegex,
    packingListJson[sheets[0]],
  );

  for (const sheet of sheets) {
    headerRow = packingListJson[sheet].findIndex(
      (x) => x.M === "NIIRMS Dispatch number",
    );

    packingListContentsTemp = packingListJson[sheet]
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
    model,
  );
}

function parse(packingListJson) {
  return parseModel(
    packingListJson,
    ParserModel.FOWLERWELCH1,
    headers.FOWLERWELCH1.establishmentNumber.regex,
  );
}

module.exports = { parse, parseModel };
