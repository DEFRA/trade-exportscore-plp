const matcher_result = require("./matcher-result");
const parser_model = require("./parser-model");
const combine_parser = require("./parser-combine");
const json_file = require("../utilities/json-file");
const file_extension = require("../utilities/file-extension");
const { parsersExcel, parsersPdf } = require("./model-parsers");
const logger = require("../utilities/logger");
const logParserServicePath = "app/services/parser-service.js";
const logParserServiceFunction = "findParser()";

const isNullOrUndefined = (value) => value === null || value === undefined;

async function findParser(packingList, filename) {
  try {
    let parsedPackingList = failedParser();
    let parserFound = false;

    // Test for Excel spreadsheets
    if (file_extension.isExcel(filename)) {
      // Sanitised packing list (i.e. emove trailing spaces and empty cells)
      const packingListJson = JSON.stringify(packingList);
      const sanitisedPackingListJson = json_file.sanitise(packingListJson);
      const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

      Object.keys(parsersExcel).forEach((key) => {
        if (
          parsersExcel[key].matches(sanitisedPackingList, filename) ===
          matcher_result.CORRECT
        ) {
          parserFound = true;
          parsedPackingList = parsersExcel[key].parse(
            sanitisedPackingList,
            filename,
          );
        }
      });

      if (!parserFound) {
        logger.log_info(
          logParserServicePath,
          logParserServiceFunction,
          `Failed to parse packing list with filename: ${filename}`,
        );
      }

      // Test for PDF spreadsheets
    } else if (file_extension.isPdf(filename)) {
      for (const key in parsersPdf) {
        if (parsersPdf.hasOwnProperty(key)) {
          const result = await parsersPdf[key].matches(packingList, filename);

          if (result.isMatched === matcher_result.CORRECT) {
            parserFound = true;
            parsedPackingList = parsersPdf[key].parse(
              result.document,
              filename,
            );
          }
        }
      }

      if (!parserFound) {
        logger.log_info(
          "app/services/parser-service.js",
          "findParser()",
          `Failed to parse packing list with filename: ${filename}`,
        );
      }
    } else {
      logger.log_info(
        logParserServicePath,
        logParserServiceFunction,
        `Failed to parse packing list with filename: ${filename}`,
      );
    }

    if (parsedPackingList.parserModel !== parser_model.NOMATCH) {
      parsedPackingList.items = parsedPackingList.items.filter(
        (x) => !Object.values(x).every(isNullOrUndefined),
      );
      parsedPackingList.items = checkType(parsedPackingList.items);
      parsedPackingList.business_checks.all_required_fields_present =
        checkRequiredData(parsedPackingList);
    }

    return parsedPackingList;
  } catch (err) {
    logger.log_error(logParserServicePath, logParserServiceFunction, err);
  }
}

function failedParser() {
  return combine_parser.combine(null, [], false, parser_model.NOMATCH);
}

function checkRequiredData(packingList) {
  const hasCommodityCode = packingList.items.every(
    (x) => x.commodity_code !== null,
  );
  const hasTreatmentOrNature = packingList.items.every(
    (x) => x.nature_of_products !== null && x.type_of_treatment !== null,
  );
  const hasDescription = packingList.items.every((x) => x.description !== null);
  const hasPackages = packingList.items.every(
    (x) => x.number_of_packages !== null,
  );
  const hasNetWeight = packingList.items.every(
    (x) => x.total_net_weight_kg !== null,
  );
  const hasRemos = packingList.registration_approval_number !== null;
  return (
    (hasCommodityCode || hasTreatmentOrNature) &&
    hasDescription &&
    hasPackages &&
    hasNetWeight &&
    hasRemos
  );
}

function checkType(packingList) {
  for (const x of packingList) {
    if (isNaN(Number(x.number_of_packages))) {
      x.number_of_packages = null;
    }
    if (isNaN(Number(x.total_net_weight_kg))) {
      x.total_net_weight_kg = null;
    }
  }
  return packingList;
}
module.exports = {
  failedParser,
  findParser,
  checkRequiredData,
  checkType,
};
