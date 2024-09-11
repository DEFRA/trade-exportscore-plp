const CombineParser = require("../../../parser-combine");
const { mapParser } = require("../../../parser-map");
const ParserModel = require("../../../parser-model");
const headers = require("../../../model-headers");

function parseModel(packingListJson, model) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];

  let headerRow = packingListJson[sheets[0]].findIndex(
    (x) => x.M === "NIIRMS Dispatch number",
  );

  const establishmentNumber =
    packingListJson[sheets[0]][headerRow + 1].M ?? null;

  for (const sheet of sheets) {
    headerRow = packingListJson[sheet].findIndex(
      (x) => x.M === "NIIRMS Dispatch number",
    );

    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      headerRow,
      headers.FOWLERWELCH1,
    );

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
  return parseModel(packingListJson, ParserModel.FOWLERWELCH1);
}

module.exports = { parse, parseModel };
