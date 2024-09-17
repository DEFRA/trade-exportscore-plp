const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.TESCO3.establishmentNumber.regex,
    packingListJson,
  );

  const dataRow = 5;
  const packingListContents = mapParser(
    packingListJson,
    dataRow - 1,
    dataRow,
    headers.TESCO3.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TESCO3,
  );
}

module.exports = {
  parse,
};
