const CombineParser = require("../../../parser-combine");
const { mapParser } = require("../../../parser-map");
const ParserModel = require("../../../parser-model");
const headers = require("../../../model-headers");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[2].M ?? null;

  const packingListContents = mapParser(packingListJson, 0, 2, headers.TESCO2);

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TESCO2,
  );
}

module.exports = {
  parse,
};
