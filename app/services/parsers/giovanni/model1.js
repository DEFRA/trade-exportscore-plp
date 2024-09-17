const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");

function parse(packingListJson) {
  try {
    const headerRow = packingListJson.findIndex((x) => x.C === "DESCRIPTION");
    const establishmentNumberRow = packingListJson.findIndex(
      (x) => x.A === "NIRMS NUMBER",
    );
    const establishmentNumber =
      packingListJson[establishmentNumberRow + 1].A ?? null;

    const packingListContents = mapParser(
      packingListJson,
      headerRow,
      headerRow + 1,
      headers.GIOVANNI1,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.GIOVANNI1,
    );
  } catch (err) {
    console.error(
      `${ParserModel.GIOVANNI1} encountered: ${err} when parsing model`,
    );
  }
}

module.exports = {
  parse,
};
