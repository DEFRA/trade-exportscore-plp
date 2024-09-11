const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");
const { mapParser } = require("../../../parser-map");
const headers = require("../../../model-headers");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].H ?? null;

  const packingListContents = mapParser(packingListJson, 0, headers.ASDA2);

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.ASDA2,
  );
}

module.exports = {
  parse,
};
