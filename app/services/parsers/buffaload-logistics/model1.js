const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.BUFFALOAD1.establishmentNumber.regex,
    packingListJson,
  );

  const packingListContents = mapParser(
    packingListJson,
    1,
    2,
    headers.BUFFALOAD1.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.BUFFALOAD1,
  );
}

module.exports = {
  parse,
};
