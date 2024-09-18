const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.TESCO1.establishmentNumber.regex,
    packingListJson,
  );

  const packingListContentsRow = 5;
  const packingListContents = mapParser(
    packingListJson,
    packingListContentsRow - 1,
    packingListContentsRow,
    headers.TESCO1.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TESCO1,
  );
}

module.exports = {
  parse,
};
