const {
  hasMissingDescription,
  hasMissingIdentifier,
  hasMissingNetWeight,
  hasMissingPackages,
  wrongTypeForPackages,
  wrongTypeNetWeight,
  hasInvalidProductCode,
  hasMissingNetWeightUnit,
  hasMissingNirms,
  hasInvalidNirms,
  hasMissingCoO,
  hasInvalidCoO,
  hasHighRiskProducts,
} = require("./packing-list-validator-utilities");
const parserModel = require("../parser-model");
const failureReasonsDescriptions = require("./packing-list-failure-reasons");

function validatePackingList(packingList) {
  const validationResult = validatePackingListByIndexAndType(packingList);
  return generateFailuresByIndexAndTypes(validationResult, packingList);
}

function validatePackingListByIndexAndType(packingList) {
  const basicValidationResults = getBasicValidationResults(packingList);
  const packingListStatusResults = getPackingListStatusResults(packingList);
  const countryOfOriginResults =
    getCountryOfOriginValidationResults(packingList);
  return {
    ...basicValidationResults,
    ...packingListStatusResults,
    ...countryOfOriginResults,
    hasAllFields: calculateHasAllFields(
      basicValidationResults,
      packingListStatusResults,
      countryOfOriginResults,
    ),
  };
}

function getBasicValidationResults(packingList) {
  return {
    missingIdentifier: findItems(packingList.items, hasMissingIdentifier),
    invalidProductCodes: findItems(packingList.items, hasInvalidProductCode),
    missingDescription: findItems(packingList.items, hasMissingDescription),
    missingPackages: findItems(packingList.items, hasMissingPackages),
    invalidPackages: findItems(packingList.items, wrongTypeForPackages),
    missingNetWeight: findItems(packingList.items, hasMissingNetWeight),
    invalidNetWeight: findItems(packingList.items, wrongTypeNetWeight),
    missingNetWeightUnit: findItems(packingList.items, hasMissingNetWeightUnit),
  };
}

function getPackingListStatusResults(packingList) {
  const hasRemos = packingList.registration_approval_number !== null;
  const isEmpty = packingList.items.length === 0;
  const missingRemos =
    packingList.registration_approval_number === null ||
    packingList.parserModel === parserModel.NOREMOS;
  const noMatch = packingList.parserModel === parserModel.NOMATCH;
  const hasSingleRms = packingList.establishment_numbers.length <= 1;

  return {
    hasRemos,
    isEmpty,
    missingRemos,
    noMatch,
    hasSingleRms,
  };
}

function getCountryOfOriginValidationResults(packingList) {
  if (!packingList.validateCountryOfOrigin) {
    return {
      missingNirms: [],
      invalidNirms: [],
      missingCoO: [],
      invalidCoO: [],
      highRiskProducts: [],
    };
  }

  return {
    missingNirms: findItems(packingList.items, hasMissingNirms),
    invalidNirms: findItems(packingList.items, hasInvalidNirms),
    missingCoO: findItems(packingList.items, hasMissingCoO),
    invalidCoO: findItems(packingList.items, hasInvalidCoO),
    highRiskProducts: findItems(packingList.items, hasHighRiskProducts),
  };
}

function calculateHasAllFields(
  basicResults,
  statusResults,
  countryOfOriginResults,
) {
  const hasAllItems =
    basicResults.missingIdentifier.length +
      basicResults.missingDescription.length +
      basicResults.missingPackages.length +
      basicResults.missingNetWeight.length +
      basicResults.missingNetWeightUnit.length ===
    0;

  const allItemsValid =
    basicResults.invalidPackages.length +
      basicResults.invalidNetWeight.length +
      basicResults.invalidProductCodes.length ===
    0;

  const countryOfOriginValid =
    countryOfOriginResults.missingNirms.length +
      countryOfOriginResults.invalidNirms.length +
      countryOfOriginResults.missingCoO.length +
      countryOfOriginResults.invalidCoO.length +
      countryOfOriginResults.highRiskProducts.length ===
    0;

  return (
    hasAllItems &&
    allItemsValid &&
    countryOfOriginValid &&
    statusResults.hasRemos &&
    !statusResults.isEmpty &&
    !statusResults.missingRemos
  );
}

function findItems(items, fn) {
  return items
    .map((val) => (fn(val) ? val.row_location : null))
    .filter((val) => val !== null);
}

function generateFailuresByIndexAndTypes(validationResult, packingList) {
  let failureReasons = "";
  if (validationResult.hasAllFields && validationResult.hasSingleRms) {
    return {
      hasAllFields: true,
    };
  } else {
    // build failure reason
    failureReasons = getFailureReasons(validationResult);
    const checks = createValidationChecks(validationResult);
    //if the net weight unit is in the header, just the description below is assigned to the failure reason
    if (
      validationResult.missingNetWeightUnit.length !== 0 &&
      packingList.unitInHeader
    ) {
      failureReasons = `${failureReasonsDescriptions.NET_WEIGHT_UNIT_MISSING}.\n`;
    }
    // if the net weight unit is not in the header, the collection of the row/sheet location and description should be added into the checks array
    else {
      checks.push({
        collection: validationResult.missingNetWeightUnit,
        description: failureReasonsDescriptions.NET_WEIGHT_UNIT_MISSING,
      });
    }
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

function createValidationChecks(validationResult) {
  return [
    {
      collection: validationResult.missingIdentifier,
      description: failureReasonsDescriptions.IDENTIFIER_MISSING,
    },
    {
      collection: validationResult.invalidProductCodes,
      description: failureReasonsDescriptions.PRODUCT_CODE_INVALID,
    },
    {
      collection: validationResult.missingDescription,
      description: failureReasonsDescriptions.DESCRIPTION_MISSING,
    },
    {
      collection: validationResult.missingPackages,
      description: failureReasonsDescriptions.PACKAGES_MISSING,
    },
    {
      collection: validationResult.missingNetWeight,
      description: failureReasonsDescriptions.NET_WEIGHT_MISSING,
    },
    {
      collection: validationResult.invalidPackages,
      description: failureReasonsDescriptions.PACKAGES_INVALID,
    },
    {
      collection: validationResult.invalidNetWeight,
      description: failureReasonsDescriptions.NET_WEIGHT_INVALID,
    },
    {
      collection: validationResult.missingNirms,
      description: failureReasonsDescriptions.NIRMS_MISSING,
    },
    {
      collection: validationResult.invalidNirms,
      description: failureReasonsDescriptions.NIRMS_INVALID,
    },
    {
      collection: validationResult.missingCoO,
      description: failureReasonsDescriptions.COO_MISSING,
    },
    {
      collection: validationResult.invalidCoO,
      description: failureReasonsDescriptions.COO_INVALID,
    },
    {
      collection: validationResult.highRiskProducts,
      description: failureReasonsDescriptions.HIGH_RISK,
    },
  ];
}

function generateFailureReasonFromRows(description, rows) {
  if (rows.length === 0) {
    return "";
  } else if (rows[0].sheetName) {
    return generateRowLocation(
      generateLocationSheetDescription,
      description,
      rows,
    );
  } else if (rows[0].pageNumber) {
    return generateRowLocation(
      generateLocatioPageDescription,
      description,
      rows,
    );
  } else {
    return generateByRow(description, rows);
  }
}

const maxItemsToShow = 3;

function generateByRow(description, rows) {
  if (rows.length === 0) {
    return "";
  } else if (rows.length === 1) {
    return `${description} in row ${rows[0].rowNumber}.\n`;
  } else if (rows.length === 2) {
    return `${description} in rows ${rows[0].rowNumber} and ${rows[1].rowNumber}.\n`;
  } else if (rows.length === maxItemsToShow) {
    return `${description} in rows ${rows[0].rowNumber}, ${rows[1].rowNumber} and ${rows[2].rowNumber}.\n`;
  } else {
    return `${description} in rows ${rows
      .slice(0, maxItemsToShow)
      .map((row) => row.rowNumber)
      .join(
        ", ",
      )} in addition to ${rows.length - maxItemsToShow} other rows.\n`;
  }
}

function generateRowLocation(generateDescription, description, rows) {
  if (rows.length === 0) {
    return "";
  } else if (rows.length === 1) {
    return `${description} in ${generateDescription(rows[0])}.\n`;
  } else if (rows.length === 2) {
    return `${description} in ${generateDescription(rows[0])} and ${generateDescription(rows[1])}.\n`;
  } else if (rows.length === maxItemsToShow) {
    return `${description} in ${generateDescription(rows[0])}, ${generateDescription(rows[1])} and ${generateDescription(rows[2])}.\n`;
  } else {
    return `${description} in ${rows
      .slice(0, maxItemsToShow)
      .map((row) => generateDescription(row))
      .join(
        ", ",
      )} in addition to ${rows.length - maxItemsToShow} other locations.\n`;
  }
}

function generateLocationSheetDescription(row) {
  return `sheet "${row.sheetName}" row ${row.rowNumber}`;
}

function generateLocatioPageDescription(row) {
  return `page ${row.pageNumber} row ${row.rowNumber}`;
}

function getFailureReasons(validationResult) {
  if (validationResult.noMatch) {
    return null;
  }
  if (validationResult.missingRemos) {
    return failureReasonsDescriptions.MISSING_REMOS;
  }
  if (validationResult.isEmpty) {
    return failureReasonsDescriptions.EMPTY_DATA;
  }
  if (!validationResult.hasSingleRms) {
    return failureReasonsDescriptions.MULTIPLE_RMS;
  }
  return "";
}

module.exports = {
  validatePackingListByIndexAndType,
  generateFailuresByIndexAndTypes,
  generateFailureReasonFromRows,
  validatePackingList,
};
