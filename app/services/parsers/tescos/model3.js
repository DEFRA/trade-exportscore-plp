const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");

function parse(packingListJson) {
  try {
    const establishmentNumberRow = 3;
    const dataRow = 5;
    const establishmentNumber =
      packingListJson[establishmentNumberRow].E ?? null;

    const packingListContents = mapParser(
      packingListJson,
      dataRow - 1,
      dataRow,
      headers.TESCO3,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.TESCO3,
    );
  } catch (err) {
    console.error(
      `${ParserModel.TESCO3} encountered: ${err} when parsing model`,
    );
  }
}

module.exports = {
  parse,
};
