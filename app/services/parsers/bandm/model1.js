const combine_parser = require("../../parser-combine");
const parser_model = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const logger = require("../../../utilities/logger");

const isNullOrUndefined = (value) => value === null || value === undefined;

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];

    const establishmentNumber = regex.findMatch(
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

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.BANDM1,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/bandm/model1.js", "matches()", err);
  }
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
