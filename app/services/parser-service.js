const matcherResult = require("./matcher-result");
const parserModel = require("./parser-model");
const combineParser = require("./parser-combine");
const jsonFile = require("../utilities/json-file");
const fileExtension = require("../utilities/file-extension");
const { parsersExcel } = require("./model-parsers");
const logger = require("../utilities/logger");

const isNullOrUndefined = (value) => value === null || value === undefined;

function findParser(packingList, filename) {
  try {
    let parsedPackingList = failedParser();
    let parserFound = false;

    // Sanitised packing list (i.e. emove trailing spaces and empty cells)
    const packingListJson = JSON.stringify(packingList);
    const sanitisedPackingListJson = jsonFile.sanitise(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);
    // Test for Excel spreadsheets
    if (fileExtension.isExcel(filename)) {
      Object.keys(parsersExcel).forEach((key) => {
        if (
          parsersExcel[key].matches(sanitisedPackingList, filename) ===
          matcherResult.CORRECT
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
          "app/services/parser-service.js",
          "findParser()",
          `Failed to parse packing list with filename: ${filename}`,
        );
      }
    } else {
      logger.log_info(
        "app/services/parser-service.js",
        "findParser()",
        `Failed to parse packing list with filename: ${filename} as it is not an Excel file.`,
      );
    }

    if (parsedPackingList.parserModel !== parserModel.NOMATCH) {
      parsedPackingList.items = parsedPackingList.items.filter(
        (x) => !Object.values(x).every(isNullOrUndefined),
      );
      parsedPackingList.items = checkType(parsedPackingList.items);
      parsedPackingList.business_checks.all_required_fields_present =
        checkRequiredData(parsedPackingList);
    }

    return parsedPackingList;
  } catch (err) {
    logger.log_error("app/services/parser-service.js", "findParser()", err);
  }
}

function failedParser() {
  return combineParser.combine(null, [], false, parserModel.NOMATCH);
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
