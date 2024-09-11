const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");
const headers = require("../../../model-headers");
const { mapParser } = require("../../../parser-map");

function parse(packingListJson) {
  const establishmentNumberRow = 3;
  const dataRow = 5;
  const establishmentNumber = packingListJson[establishmentNumberRow].E ?? null;

  const packingListContents = mapParser(
    packingListJson,
    dataRow - 1,
    headers.TESCO3,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TESCO3,
  );
}

module.exports = {
  parse,
};
