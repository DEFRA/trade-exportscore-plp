const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");
const headers = require("../../../model-headers");
const { mapParser } = require("../../../parser-map");

function parse(packingListJson) {
  const packingListContentsRow = 5;
  const establishmentNumberRow = 3;
  const establishmentNumber =
    packingListJson[establishmentNumberRow].AT ?? null;

  const packingListContents = mapParser(
    packingListJson,
    packingListContentsRow - 1,
    headers.TESCO1,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TESCO1,
  );
}

module.exports = {
  parse,
};
