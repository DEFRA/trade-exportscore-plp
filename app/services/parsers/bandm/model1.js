const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");

const isNullOrUndefined = (value) => value === null || value === undefined;

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  const establishmentNumber = Regex.findMatch(
    headers.BANDM1.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  const headerTitles = Object.values(headers.BANDM1.headers);
  function callback(x) {
    return Object.values(x).includes(headerTitles[0]);
  }
  const headerRow = rowFinder(packingListJson[sheets[0]], callback);

  for (const sheet of sheets) {
    const lastRow =
      packingListJson[sheet]
        .slice(headerRow + 1)
        .findIndex((x) => isEndOfRow(x)) + headerRow;
    packingListContentsTemp = packingListJson[sheet]
      .slice(headerRow + 1, lastRow + 1)
      .map((col) => ({
        description: col.C ?? null,
        nature_of_products: null,
        type_of_treatment: null,
        commodity_code: col.D ?? null,
        number_of_packages: col.F ?? null,
        total_net_weight_kg: col.G ?? null,
      }));
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.BANDM1,
  );
}

function isEndOfRow(x) {
  const isTotal = x.F !== null && x.G !== null && x.H !== null;
  const isEmpty =
    isNullOrUndefined(x.A) &&
    isNullOrUndefined(x.B) &&
    isNullOrUndefined(x.C) &&
    isNullOrUndefined(x.D) &&
    isNullOrUndefined(x.E);
  return isTotal && isEmpty;
}

module.exports = {
  parse,
  isEndOfRow,
};
