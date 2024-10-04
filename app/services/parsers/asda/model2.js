const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  const establishmentNumber = Regex.findMatch(
    headers.ASDA2.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      0,
      1,
      headers.ASDA2.headers,
    );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

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
