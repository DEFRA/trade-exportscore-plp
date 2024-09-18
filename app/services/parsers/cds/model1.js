const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.CDS1.establishmentNumber.regex,
    packingListJson,
  );

  const dataRow = 1;
  const packingListContents = mapParser(
    packingListJson,
    dataRow - 1,
    dataRow,
    headers.CDS1.headers,
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
