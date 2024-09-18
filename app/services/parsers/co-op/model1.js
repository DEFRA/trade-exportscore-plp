const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.COOP1.establishmentNumber.regex,
    packingListJson,
  );

  const packingListContents = mapParser(
    packingListJson,
    0,
    1,
    headers.COOP1.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.COOP1,
  );
}

module.exports = {
  parse,
};
