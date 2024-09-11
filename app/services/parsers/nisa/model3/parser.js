const CombineParser = require("../../../parser-combine");
const { mapParser } = require("../../../parser-map");
const ParserModel = require("../../../parser-model");
const headers = require("../../../model-headers");

function parse(packingListJson) {
  const establishmentNumberRow = 1;
  const dataRowFirst = 3;
  const establishmentNumber = packingListJson[establishmentNumberRow].A ?? null;
  console.log(headers.NISA3);
  const packingListContents = mapParser(
    packingListJson,
    dataRowFirst - 1,
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
