const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.KEPAK1.establishmentNumber.regex,
    packingListJson,
  );

  const dataRow = 21;
  const packingListContents = mapParser(
    packingListJson,
    dataRow - 1,
    dataRow,
    headers.KEPAK1.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.KEPAK1,
  );
}

module.exports = {
  parse,
};
