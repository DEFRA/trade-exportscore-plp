const ParserModel = require("../../../parser-model");
const CombineParser = require("../../../parser-combine");
const { mapParser } = require("../../../parser-map");
const headers = require("../../../model-headers");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].E ?? null;

  const packingListContents = mapParser(packingListJson, 0, headers.COOP1);

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.COOP1,
  );
}

module.exports = {
  parse,
};
