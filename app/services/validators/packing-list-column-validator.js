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
  hasIneligibleItems,
} = require("./packing-list-validator-utilities");
const parserModel = require("../parser-model");
const failureReasonsDescriptions = require("./packing-list-failure-reasons");

async function validatePackingList(packingList) {
  const validationResult = await validatePackingListByIndexAndType(packingList);
  return generateFailuresByIndexAndTypes(validationResult, packingList);
}

async function validatePackingListByIndexAndType(packingList) {
  const basicValidationResults = getBasicValidationResults(packingList);
  const packingListStatusResults = getPackingListStatusResults(packingList);
  const countryOfOriginResults =
    await getCountryOfOriginValidationResults(packingList);
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

async function getCountryOfOriginValidationResults(packingList) {
  if (!packingList.validateCountryOfOrigin) {
    return {
      missingNirms: [],
      invalidNirms: [],
      missingCoO: [],
      invalidCoO: [],
      ineligibleItems: [],
    };
  }

  return {
    missingNirms: findItems(packingList.items, hasMissingNirms),
    invalidNirms: findItems(packingList.items, hasInvalidNirms),
    missingCoO: findItems(packingList.items, hasMissingCoO),
    invalidCoO: findItems(packingList.items, hasInvalidCoO),
    ineligibleItems: await findItemsAsync(
      packingList.items,
      hasIneligibleItems,
    ),
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
      countryOfOriginResults.ineligibleItems.length ===
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

async function findItemsAsync(items, fn) {
  const results = await Promise.all(
    items.map(async (val) => ((await fn(val)) ? val.row_location : null)),
  );
  return results.filter((val) => val !== null);
}

function generateFailuresByIndexAndTypes(validationResult, packingList) {
  if (validationResult.hasAllFields && validationResult.hasSingleRms) {
    return {
      hasAllFields: true,
    };
  } else {
    // build failure reason
    const failuresAndChecks = {
      failureReasons: getFailureReasons(validationResult),
      checks: createValidationChecks(validationResult),
    };

    // Handle multiple RMS as a special case
    addSingleRmsFailureReason(validationResult, failuresAndChecks);

    // Handle net weight unit as a special case
    addNetWeightFailuireReasonOrCheck(
      validationResult,
      packingList.unitInHeader,
      failuresAndChecks,
    );

    // if there is a nirms blanket statement, just the description below is assigned to the failure reason
    addNirmsFailureReasonOrCheck(
      validationResult,
      packingList.blanketNirms,
      failuresAndChecks,
    );

    const failingChecks = failuresAndChecks.checks.filter(
      (check) => check.collection.length > 0,
    );
    for (const check of failingChecks) {
      failuresAndChecks.failureReasons += generateFailureReasonFromRows(
        check.description,
        check.collection,
      );
    }

    return {
      hasAllFields: false,
      failureReasons: failuresAndChecks.failureReasons,
    };
  }
}

function addSingleRmsFailureReason(validationResult, reasonsAndChecks) {
  if (!validationResult.hasSingleRms) {
    reasonsAndChecks.failureReasons += failureReasonsDescriptions.MULTIPLE_RMS;
  }
}

function addNetWeightFailuireReasonOrCheck(
  validationResult,
  unitInHeader,
  reasonsAndChecks,
) {
  if (validationResult.missingNetWeightUnit.length !== 0 && unitInHeader) {
    reasonsAndChecks.failureReasons += `${failureReasonsDescriptions.NET_WEIGHT_UNIT_MISSING}.\n`;
  }
  // if the net weight unit is not in the header, the collection of the row/sheet location and description should be added into the checks array
  else {
    reasonsAndChecks.checks.push({
      collection: validationResult.missingNetWeightUnit,
      description: failureReasonsDescriptions.NET_WEIGHT_UNIT_MISSING,
    });
  }
}

function addNirmsFailureReasonOrCheck(
  validationResult,
  blanketNirms,
  reasonsAndChecks,
) {
  if (validationResult.missingNirms.length !== 0 && blanketNirms) {
    reasonsAndChecks.failureReasons += `${failureReasonsDescriptions.NIRMS_MISSING}.\n`;
  }
  // if there is no nirms blanket statement, the collection of the row/sheet location and description should be added into the checks array
  else {
    reasonsAndChecks.checks.push({
      collection: validationResult.missingNirms,
      description: failureReasonsDescriptions.NIRMS_MISSING,
    });
  }
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
      collection: validationResult.ineligibleItems,
      description: failureReasonsDescriptions.PROHIBITED_ITEM,
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
      )} in addition to ${rows.length - maxItemsToShow} other locations.\n`;
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
  return "";
}

module.exports = {
  validatePackingListByIndexAndType,
  generateFailuresByIndexAndTypes,
  generateFailureReasonFromRows,
  validatePackingList,
};
