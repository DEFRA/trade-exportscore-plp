const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");

function parse(packingListJson) {
  const establishmentNumberRow =
    packingListJson.findIndex((x) => x.A === "NIRMS NUMBER") + 1;
  const headerRow = packingListJson.findIndex((x) => x.C === "DESCRIPTION");
  const dataRow = headerRow + 1;

  const establishmentNumber = packingListJson[establishmentNumberRow].A ?? null;

  const packingListContents = mapParser(
    packingListJson,
    headerRow,
    dataRow,
    headers.NUTRICIA1,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.NUTRICIA1,
  );
}

module.exports = {
  parse,
};
