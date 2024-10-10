const combine_parser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parseModel(packingListJson, model, establishmentNumberRegex) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];

    let headerRow = packingListJson[sheets[0]].findIndex(
      (x) => x.F === headers.FOWLERWELCH1.headers.description,
    );
    const establishmentNumber = regex.findMatch(
      establishmentNumberRegex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      headerRow = packingListJson[sheet].findIndex(
        (x) => x.F === headers.FOWLERWELCH1.headers.description,
      );

      packingListContentsTemp = packingListJson[sheet]
        .slice(headerRow + 1)
        .map((col) => ({
          description: col.F ?? null,
          nature_of_products: null,
          type_of_treatment: col.N ?? null,
          commodity_code: col.C ?? null,
          number_of_packages: col.H ?? null,
          total_net_weight_kg: col.K ?? null,
        }));

      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      model,
    );
  } catch (err) {
    logger.logError(
      "app/services/parsers/fowlerwelch/model1.js",
      "matches()",
      err,
    );
  }
}

function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.FOWLERWELCH1,
    headers.FOWLERWELCH1.establishmentNumber.regex,
  );
}

module.exports = { parse, parseModel };
