const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");

function parse(packingListJson) {
  try {
    const establishmentNumber = packingListJson[1]?.D ?? null;

    const packingListContents = mapParser(packingListJson, 0, 1, headers.ASDA1);

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.ASDA1,
    );
  } catch (err) {
    console.error(
      `${ParserModel.ASDA1} encountered: ${err} when parsing model`,
    );
  }
}

module.exports = {
  parse,
};
