const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  const establishmentNumber = Regex.findMatch(
    headers.NISA2.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  const dataRowFirst = 3;

  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      dataRowFirst - 1,
      dataRowFirst,
      headers.NISA2.headers,
    );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

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
