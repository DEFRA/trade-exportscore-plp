const CombineParser = require("../../../parser-combine");
const { mapParser } = require("../../../parser-map");
const ParserModel = require("../../../parser-model");
const headers = require("../../../model-headers");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].B ?? null;

  const packingListContents = mapParser(packingListJson, 0, 1, headers.NISA1);

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.NISA2,
  );
}

module.exports = {
  parse,
};
