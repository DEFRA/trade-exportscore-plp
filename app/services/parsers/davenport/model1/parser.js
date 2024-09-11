const ParserModel = require("../../../parser-model");
const CombineParser = require("../../../parser-combine");
const { mapParser } = require("../../../parser-map");
const headers = require("../../../model-headers");

function parse(packingListJson) {
  const establishmentNumberRow = 18;
  const dataRow = 45;

  const establishmentNumber = packingListJson[establishmentNumberRow].C ?? null;

  const packingListContents = mapParser(
    packingListJson,
    dataRow - 1,
    headers.DAVENPORT1,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.DAVENPORT1,
  );
}

module.exports = {
  parse,
};
