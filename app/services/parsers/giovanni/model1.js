const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const headerRow = packingListJson.findIndex((x) => x.C === "DESCRIPTION");
  const establishmentNumber = Regex.findMatch(
    headers.GIOVANNI1.establishmentNumber.regex,
    packingListJson,
  );

  const packingListContents = mapParser(
    packingListJson,
    headerRow,
    headerRow + 1,
    headers.GIOVANNI1.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.GIOVANNI1,
  );
}

module.exports = {
  parse,
};
