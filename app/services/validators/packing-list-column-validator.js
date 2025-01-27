const {
  hasMissingDescription,
  hasMissingIdentifier,
  hasMissingNetWeight,
  hasMissingPackages,
  wrongTypeForPackages,
  wrongTypeNetWeight,
} = require("./packing-list-validator-utilities");
const parserModel = require("../parser-model");

function validatePackingList(packingList) {
  const validationResult = validatePackingListByIndexAndType(packingList);
  return generateFailuresByIndexAndTypes(validationResult);
}

function validatePackingListByIndexAndType(packingList) {
  const missingIdentifier = findItems(packingList.items, hasMissingIdentifier);
  const missingDescription = findItems(
    packingList.items,
    hasMissingDescription,
  );
  const missingPackages = findItems(packingList.items, hasMissingPackages);
  const invalidPackages = findItems(packingList.items, wrongTypeForPackages);
  const missingNetWeight = findItems(packingList.items, hasMissingNetWeight);
  const invalidNetWeight = findItems(packingList.items, wrongTypeNetWeight);

  const hasRemos = packingList.registration_approval_number !== null;
  const isEmpty = packingList.items.length === 0;
  const missingRemos =
    packingList.registration_approval_number === null ||
    packingList.parserModel === parserModel.NOREMOS;
  const noMatch = packingList.parserModel === parserModel.NOMATCH;

  return {
    missingIdentifier,
    missingDescription,
    missingPackages,
    invalidPackages,
    missingNetWeight,
    invalidNetWeight,
    hasRemos,
    isEmpty,
    missingRemos,
    noMatch,
    hasAllFields:
      missingIdentifier.length === 0 &&
      missingDescription.length === 0 &&
      missingPackages.length === 0 &&
      invalidPackages.length === 0 &&
      missingNetWeight.length === 0 &&
      invalidNetWeight.length === 0 &&
      hasRemos &&
      !isEmpty &&
      !missingRemos,
  };
}

function findItems(items, fn) {
  return items
    .map((val, index) => (fn(val) ? index + 1 : null))
    .filter((val) => val !== null);
}

function generateFailuresByIndexAndTypes(validationResult) {
  if (validationResult.hasAllFields) {
    return {
      hasAllFields: true,
    };
  } else {
    // build failure reason
    let failureReasons = "";
    if (validationResult.noMatch) {
      failureReasons = null; //"unrecognised parser";
    } else if (validationResult.missingRemos) {
      failureReasons = "Check GB Establishment RMS Number";
    } else if (validationResult.isEmpty) {
      failureReasons = "No product line data found.";
    } else {
      const checks = [
        {
          collection: validationResult.missingIdentifier,
          description: "Identifier is missing",
        },
        {
          collection: validationResult.missingDescription,
          description: "Product description is missing",
        },
        {
          collection: validationResult.missingPackages,
          description: "No of packages is missing",
        },
        {
          collection: validationResult.missingNetWeight,
          description: "Total net weight is missing",
        },
        {
          collection: validationResult.invalidPackages,
          description: "No of packages is invalid",
        },
        {
          collection: validationResult.invalidNetWeight,
          description: "Total net weight is invalid",
        },
      ];

      checks.forEach((check) => {
        if (check.collection.length > 0) {
          failureReasons += generateFailureReasonFromRows(
            check.description,
            check.collection,
          );
        }
      });
    }

    return {
      hasAllFields: false,
      failureReasons,
    };
  }
}

function generateFailureReasonFromRows(description, rows) {
  const maxItemsToShow = 3;
  if (rows.length === 0) {
    return "";
  } else if (rows.length === 1) {
    return `${description} in row ${rows[0]}.\n`;
  } else if (rows.length === 2) {
    return `${description} in rows ${rows[0]} and ${rows[1]}.\n`;
  } else if (rows.length === maxItemsToShow) {
    return `${description} in rows ${rows[0]}, ${rows[1]} and ${rows[2]}.\n`;
  } else {
    return `${description} in rows ${rows.slice(0, maxItemsToShow).join(", ")} in addition to ${rows.length - maxItemsToShow} other rows.\n`;
  }
}

module.exports = {
  validatePackingListByIndexAndType,
  generateFailuresByIndexAndTypes,
  generateFailureReasonFromRows,
  validatePackingList,
};
