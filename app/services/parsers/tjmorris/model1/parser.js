const CombineParser = require("../../../parser-combine");
const ParserModel = require("../../../parser-model");
const headers = require("../../../model-headers");
const { mapParser } = require("../../../parser-map");

function parse(packingListJson) {
  const establishmentNumber = packingListJson[1].A ?? null;

  const packingListContents = mapParser(packingListJson, 0, headers.TJMORRIS1);

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TJMORRIS1,
  );
}

module.exports = {
  parse,
};
