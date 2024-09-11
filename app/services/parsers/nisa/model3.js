const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");

function parse(packingListJson) {
  const establishmentNumberRow = 1;
  const dataRowFirst = 3;
  const establishmentNumber = packingListJson[establishmentNumberRow].A ?? null;

  const packingListContents = mapParser(
    packingListJson,
    dataRowFirst - 1,
    dataRowFirst,
    headers.NISA3,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.NISA3,
  );
}

module.exports = {
  parse,
};
