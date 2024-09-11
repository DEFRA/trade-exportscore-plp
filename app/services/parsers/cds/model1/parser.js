const ParserModel = require("../../../parser-model");
const CombineParser = require("../../../parser-combine");
const headers = require("../../../model-headers");
const { mapParser } = require("../../../parser-map");

function parse(packingListJson) {
  const establishmentNumberRow = 1;
  const dataRow = 1;

  const placeOfDispatchSplit =
    packingListJson[establishmentNumberRow].K?.split("/") ?? [];
  const establishmentNumber =
    placeOfDispatchSplit.length > 1 ? placeOfDispatchSplit[1].trim() : null;

  const packingListContents = mapParser(
    packingListJson,
    dataRow - 1,
    dataRow,
    headers.CDS1,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.CDS1,
  );
}

module.exports = {
  parse,
};
