const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");
const headers = require("../../../model-headers");
const { mapParser } = require("../../../parser-map");

function parse(packingListJson) {
  const headerRow = packingListJson.findIndex((x) => x.C === "DESCRIPTION");
  const establishmentNumberRow = packingListJson.findIndex(
    (x) => x.A === "NIRMS NUMBER",
  );
  const establishmentNumber =
    packingListJson[establishmentNumberRow + 1].A ?? null;

  const packingListContents = mapParser(
    packingListJson,
    headerRow,
    headers.GIOVANNI1,
  );

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
