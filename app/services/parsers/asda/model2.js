const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");

function parse(packingListJson) {
  try {
    const establishmentNumber = packingListJson[1].H ?? null;

    const packingListContents = mapParser(packingListJson, 0, 1, headers.ASDA2);

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.ASDA2,
    );
  } catch (err) {
    console.error(
      `${ParserModel.ASDA2} encountered: ${err} when parsing model`,
    );
  }
}

module.exports = {
  parse,
};
