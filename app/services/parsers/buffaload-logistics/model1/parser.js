const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");
const headers = require("../../../model-headers");
const { mapParser } = require("../../../parser-map");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[0].B;

  const packingListContents = mapParser(packingListJson, 1, headers.BUFFALOAD1);

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.BUFFALOAD1,
  );
}

module.exports = {
  parse,
};
