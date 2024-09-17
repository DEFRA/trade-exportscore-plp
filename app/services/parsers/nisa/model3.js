const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.NISA3.establishmentNumber.regex,
    packingListJson,
  );

  const dataRowFirst = 3;
  const packingListContents = mapParser(
    packingListJson,
    dataRowFirst - 1,
    dataRowFirst,
    headers.NISA3.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.NISA3,
  );
}

module.exports = {
  parse,
};
