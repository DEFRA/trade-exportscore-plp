const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.ASDA2.establishmentNumber.regex,
    packingListJson,
  );

  const packingListContents = mapParser(
    packingListJson,
    0,
    1,
    headers.ASDA2.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.ASDA2,
  );
}

module.exports = {
  parse,
};
