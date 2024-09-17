const parserModel = require("./parser-model");
const jsonFile = require("../utilities/json-file");
const fileExtension = require("../utilities/file-extension");
const processExcelPackingList = require("./parse-excel-packing-list");

const isNullOrUndefined = (value) => value === null || value === undefined;
function findParser(packingList, filename) {
  let parsedPackingList = processExcelPackingList.failedParser();

  const packingListJson = JSON.stringify(packingList);
  const sanitisedPackingListJson = jsonFile.sanitise(packingListJson);
  const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

  if (fileExtension.isExcel(filename)) {
    parsedPackingList = processExcelPackingList.processExcelPackingList(
      sanitisedPackingList,
      filename,
    );
  } else {
    console.info("Failed to parse packing list with filename: ", filename);
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
  findParser,
  checkRequiredData,
  checkType,
};
