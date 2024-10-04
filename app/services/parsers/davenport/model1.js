const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  const establishmentNumber = Regex.findMatch(
    headers.DAVENPORT1.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  const dataRow = 45;
  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      dataRow - 1,
      dataRow,
      headers.DAVENPORT1.headers,
    );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.DAVENPORT1,
  );
}

module.exports = {
  parse,
};
