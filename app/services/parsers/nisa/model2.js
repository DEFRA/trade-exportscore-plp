const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.NISA2.establishmentNumber.regex,
    packingListJson,
  );

  const packingListContents = mapParser(
    packingListJson,
    0,
    1,
    headers.NISA1.headers,
  );

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
