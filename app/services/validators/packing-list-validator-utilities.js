/**
 * Utility validators and helpers for packing list column validation.
 *
 * Exports a set of predicate functions used by the packing-list validator
 * pipeline. Keep this module free of side-effects so it can be unit tested
 * easily. Module-level documentation should appear before any `require`.
 */

const regex = require("../../utilities/regex");
const isoCodesData = require("../data/data-iso-codes.json");
const ineligibleItemsService = require("../ineligible-items-service");

/**
 * Check whether a value is null, undefined or an empty string.
 * @param {*} value - Value to test.
 * @returns {boolean} True when value is null/undefined/empty string.
 */
function isNullOrEmptyString(value) {
  return value === null || value === undefined || value === "";
}

/**
 * Determine whether an item is missing an identifier (either commodity code
 * or both nature_of_products and type_of_treatment).
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when identifier data is missing.
 */
function hasMissingIdentifier(item) {
  return !(
    (!isNullOrEmptyString(item.nature_of_products) &&
      !isNullOrEmptyString(item.type_of_treatment)) ||
    !isNullOrEmptyString(item.commodity_code)
  );
}

/**
 * Check if the `commodity_code` contains non-digit characters (ignoring whitespace).
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when the product code is present and contains non-digits.
 */
function hasInvalidProductCode(item) {
  if (isNullOrEmptyString(item.commodity_code)) {
    return false;
  }
  return (
    item.commodity_code.toString().replaceAll(/\s+/g, "").match(/^\d*$/) ===
    null
  );
}

/**
 * Check if an item's description is missing.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when `description` is null/undefined/empty.
 */
function hasMissingDescription(item) {
  return isNullOrEmptyString(item.description);
}

/**
 * Check if the `number_of_packages` field is missing.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when `number_of_packages` is null/undefined/empty.
 */
function hasMissingPackages(item) {
  return isNullOrEmptyString(item.number_of_packages);
}

/**
 * Validate the numeric type for `number_of_packages`.
 * Returns false when the value is missing; true when it's non-numeric or negative.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when `number_of_packages` is invalid.
 */
function wrongTypeForPackages(item) {
  // Check if number_of_packages is null, undefined, or an empty string
  if (isNullOrEmptyString(item.number_of_packages)) {
    return false;
  }

  const numberOfPackages = Number(item.number_of_packages);
  return Number.isNaN(numberOfPackages) || numberOfPackages < 0;
}

/**
 * Check if the `total_net_weight_kg` field is missing.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when net weight value is missing.
 */
function hasMissingNetWeight(item) {
  return isNullOrEmptyString(item.total_net_weight_kg);
}

/**
 * Validate the numeric type for `total_net_weight_kg`.
 * Returns false when the value is missing; true when it's non-numeric or negative.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when `total_net_weight_kg` is invalid.
 */
function wrongTypeNetWeight(item) {
  // Check if total_net_weight_kg is null, undefined, or an empty string
  if (isNullOrEmptyString(item.total_net_weight_kg)) {
    return false;
  }

  const totalNetWeightKg = Number(item.total_net_weight_kg);
  return Number.isNaN(totalNetWeightKg) || totalNetWeightKg < 0;
}

/**
 * Remove item objects that only contain an empty `row_location` and no data.
 * @param {Array<Object>} packingListItems - Array of item objects.
 * @returns {Array<Object>} Filtered array with empty entries removed.
 */
function removeEmptyItems(packingListItems) {
  const isNullOrUndefined = (entry) =>
    entry[0] === "row_location" || entry[1] === null || entry[1] === undefined;
  return packingListItems.filter(
    (x) => !Object.entries(x).every(isNullOrUndefined),
  );
}

/**
 * Mutate items to null out invalid numeric fields for packages/net weight.
 * @param {Array<Object>} packingListItems - Array of item objects.
 * @returns {Array<Object>} The same array after invalid values are nulled.
 */
function removeBadData(packingListItems) {
  for (const x of packingListItems) {
    if (wrongTypeForPackages(x)) {
      x.number_of_packages = null;
    }
    if (wrongTypeNetWeight(x)) {
      x.total_net_weight_kg = null;
    }
  }
  return packingListItems;
}

/**
 * Check whether a net weight unit is present and recognised.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when the unit is missing or unrecognised.
 */
function hasMissingNetWeightUnit(item) {
  return (
    isNullOrEmptyString(item.total_net_weight_unit) ||
    !regex.findUnit(item.total_net_weight_unit)
  );
}

/**
 * Check whether the `nirms` declaration is missing for an item.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when `nirms` is null/undefined/empty.
 */
function hasMissingNirms(item) {
  return isNullOrEmptyString(item.nirms);
}

/**
 * Validate the `nirms` field – it must match either NIRMS or Non-NIRMS patterns.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when `nirms` is present but invalid.
 */
function hasInvalidNirms(item) {
  return (
    !isNullOrEmptyString(item.nirms) &&
    !isNirms(item.nirms) &&
    !isNotNirms(item.nirms)
  );
}

/**
 * Check whether Country of Origin is missing for NIRMS items.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when the item is NIRMS and country_of_origin is missing.
 */
function hasMissingCoO(item) {
  return isNirms(item.nirms) && isNullOrEmptyString(item.country_of_origin);
}

/**
 * Check whether Country of Origin value is invalid for NIRMS items.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when the item is NIRMS and the country_of_origin is invalid.
 */
function hasInvalidCoO(item) {
  return isNirms(item.nirms) && isInvalidCoO(item.country_of_origin);
}

/**
 * Identify whether an item is considered a prohibited item based on country,
 * commodity code prefix and treatment type.
 * @param {Object} item - Packing list item object.
 * @returns {boolean} True when the item matches an entry from the prohibited list.
 */
async function hasIneligibleItems(item) {
  if (
    !isNirms(item.nirms) ||
    isNullOrEmptyString(item.country_of_origin) ||
    isInvalidCoO(item.country_of_origin) ||
    isNullOrEmptyString(item.commodity_code)
  ) {
    return false;
  }

  const ineligibleItems = await ineligibleItemsService.getIneligibleItems();
  return isIneligibleItems(
    item.country_of_origin,
    item.commodity_code,
    item.type_of_treatment,
    ineligibleItems,
  );
}

/**
 * Determine if a value indicates NIRMS (green lane) status.
 * @param {string} nirms - The raw nirms field value.
 * @returns {boolean} True when value matches NIRMS patterns.
 */
function isNirms(nirms) {
  const nirmsValues = [/^(yes|nirms|green|y|g)$/i, /^green lane/i];
  return stringMatchesPattern(nirms, nirmsValues);
}

/**
 * Determine if a value indicates Non-NIRMS (red lane) status.
 * @param {string} nirms - The raw nirms field value.
 * @returns {boolean} True when value matches Non-NIRMS patterns.
 */
function isNotNirms(nirms) {
  const notNirmsPatterns = [
    /^(no|non[- ]?nirms|red|n|r)$/i, //equals
    /^red lane/i, // starts with
  ];
  return stringMatchesPattern(nirms, notNirmsPatterns);
}

/**
 * Test a string against an array of regular expression patterns.
 * @param {string} input - Input string to test.
 * @param {Array<RegExp>} regexPatterns - Array of regexp patterns.
 * @returns {boolean} True when any pattern matches the trimmed/lowercased input.
 */
function stringMatchesPattern(input, regexPatterns) {
  if (typeof input !== "string") {
    return false;
  }

  const value = input.trim().toLowerCase();
  return regexPatterns.some((pattern) => pattern.test(value));
}

/**
 * Validate a country-of-origin field. Accepts single or comma-separated codes,
 * and special-case 'x' as valid.
 * @param {*} countryOfOrigin - Raw country_of_origin value from item.
 * @returns {boolean} True when value is present but invalid.
 */
function isInvalidCoO(countryOfOrigin) {
  if (isNullOrEmptyString(countryOfOrigin)) {
    return false;
  }

  if (typeof countryOfOrigin !== "string") {
    return true;
  }

  const normalizedValue = countryOfOrigin.trim().toLowerCase();

  // Special case for "x"
  if (normalizedValue === "x") {
    return false;
  }

  // Check if it contains comma-separated values
  if (normalizedValue.includes(",")) {
    const codes = normalizedValue.split(",");
    // All individual codes must be valid
    return codes.some((code) => !isValidIsoCode(code.trim()));
  }

  // Single value case
  return !isValidIsoCode(countryOfOrigin);
}

/**
 * Check whether a single code exists in the ISO codes data.
 * @param {string} code - ISO code to validate.
 * @returns {boolean} True when `code` is a valid ISO code (case-insensitive).
 */
function isValidIsoCode(code) {
  if (!code || typeof code !== "string") {
    return false;
  }
  const normalisedCode = code.toLowerCase();
  return isoCodesData.some(
    (isoCode) => isoCode.toLowerCase() === normalisedCode,
  );
}

/**
 * Check if item treatment matches any exception rule.
 * @param {Array} exceptionRules - Array of exception rules (with "!" prefix).
 * @param {string|null} normalizedTypeOfTreatment - Normalized treatment type.
 * @returns {boolean} True if treatment matches an exception.
 */
function matchesExceptionRule(exceptionRules, normalizedTypeOfTreatment) {
  if (!normalizedTypeOfTreatment) {
    return false;
  }
  return exceptionRules.some((rule) => {
    const exceptionTreatment = rule.type_of_treatment.substring(1);
    return (
      normalizedTypeOfTreatment.toLowerCase() ===
      exceptionTreatment.toLowerCase()
    );
  });
}

/**
 * Check if item matches standard prohibition rules.
 * @param {Array} standardRules - Array of standard prohibition rules.
 * @param {string|null} normalizedTypeOfTreatment - Normalized treatment type.
 * @returns {boolean} True if item matches a standard rule.
 */
function matchesStandardRule(standardRules, normalizedTypeOfTreatment) {
  return standardRules.some((rule) => {
    if (!rule.type_of_treatment || !normalizedTypeOfTreatment) {
      return true;
    }
    return (
      normalizedTypeOfTreatment.toLowerCase() ===
      rule.type_of_treatment.toLowerCase()
    );
  });
}

// Checks if the combination exists in ineligible items data
/**
 * Determine whether a given item (COO + commodity code prefix + treatment)
 * appears in the prohibited items dataset. Handles "!" prefix logic for treatments:
 * - "!X" means prohibited UNLESS treatment is X (exception rule)
 * - "X" means prohibited IF treatment is X (standard rule)
 * Multiple "!" rules act as OR - item is allowed if it matches ANY exception.
 * @param {string} countryOfOrigin - Country of origin string (may be comma-separated).
 * @param {string|number} commodityCode - Commodity code from the item.
 * @param {string} typeOfTreatment - Type of treatment string.
 * @returns {boolean} True when the combination matches a prohibited item entry.
 */
function isIneligibleItems(
  countryOfOrigin,
  commodityCode,
  typeOfTreatment,
  ineligibleItemsData,
) {
  const normalizedTypeOfTreatment =
    typeof typeOfTreatment === "string" && typeOfTreatment.trim() !== ""
      ? typeOfTreatment.trim()
      : null;

  const matchingEntries = ineligibleItemsData.filter(
    (item) =>
      isCountryOfOriginMatching(countryOfOrigin, item.country_of_origin) &&
      commodityCode
        .toString()
        .toLowerCase()
        .startsWith(item.commodity_code?.toLowerCase()),
  );

  if (matchingEntries.length === 0) {
    return false;
  }

  const exceptionRules = matchingEntries.filter((item) =>
    item.type_of_treatment?.startsWith("!"),
  );
  const standardRules = matchingEntries.filter(
    (item) => !item.type_of_treatment?.startsWith("!"),
  );

  if (exceptionRules.length > 0) {
    const matchesException = matchesExceptionRule(
      exceptionRules,
      normalizedTypeOfTreatment,
    );
    if (matchesException) {
      return false;
    }
    return true; // Has exception rules but doesn't match any
  }

  return matchesStandardRule(standardRules, normalizedTypeOfTreatment);
}

// Helper function to check if country of origin matches (handles comma-separated values)
/**
 * Compare a country_of_origin value against a prohibited-item country which may
 * be a single code. Handles comma-separated COO values by testing any match.
 * @param {string} countryOfOrigin - Item's COO (may be comma separated).
 * @param {string} prohibitedItemCountryOfOrigin - Prohibited item COO from dataset.
 * @returns {boolean} True when any COO code matches the prohibited country.
 */
function isCountryOfOriginMatching(
  countryOfOrigin,
  prohibitedItemCountryOfOrigin,
) {
  if (
    isNullOrEmptyString(countryOfOrigin) ||
    isNullOrEmptyString(prohibitedItemCountryOfOrigin)
  ) {
    return false;
  }

  const normalizedCountry = countryOfOrigin.toLowerCase();
  const normalizedProhibitedItemCountry =
    prohibitedItemCountryOfOrigin.toLowerCase();

  // Check if countryOfOrigin contains comma-separated values
  if (normalizedCountry.includes(",")) {
    const countryCodes = normalizedCountry.split(",");
    // Check if any of the country codes matches the prohibited item country
    return countryCodes.some(
      (code) => code.trim() === normalizedProhibitedItemCountry,
    );
  }

  // Single value case
  return normalizedCountry === normalizedProhibitedItemCountry;
}

module.exports = {
  hasMissingDescription,
  hasInvalidProductCode,
  hasMissingIdentifier,
  hasMissingNetWeight,
  hasMissingPackages,
  wrongTypeForPackages,
  wrongTypeNetWeight,
  removeEmptyItems,
  removeBadData,
  hasMissingNetWeightUnit,
  hasMissingNirms,
  hasInvalidNirms,
  hasMissingCoO,
  hasInvalidCoO,
  hasIneligibleItems,
  isNirms,
  isNotNirms,
};
