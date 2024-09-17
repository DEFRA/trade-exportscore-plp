const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.NUTRICIA1.establishmentNumber.regex,
    packingListJson,
  );

  const headerRow = packingListJson.findIndex((x) => x.C === "DESCRIPTION");
  const dataRow = headerRow + 1;
  const packingListContents = mapParser(
    packingListJson,
    headerRow,
    dataRow,
    headers.NUTRICIA1.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.NUTRICIA1,
  );
}

module.exports = {
  parse,
};
