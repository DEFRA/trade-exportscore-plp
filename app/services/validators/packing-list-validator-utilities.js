const regex = require("../../utilities/regex");
const isoCodesData = require("../data/data-iso-codes.json");
const highRiskProductsData = require("../data/data-high-risk-products.json");

function isNullOrEmptyString(value) {
  return value === null || value === undefined || value === "";
}

function hasMissingIdentifier(item) {
  return !(
    (!isNullOrEmptyString(item.nature_of_products) &&
      !isNullOrEmptyString(item.type_of_treatment)) ||
    !isNullOrEmptyString(item.commodity_code)
  );
}

function hasInvalidProductCode(item) {
  if (isNullOrEmptyString(item.commodity_code)) {
    return false;
  }
  return (
    item.commodity_code.toString().replace(/\s+/g, "").match(/^\d*$/) === null
  );
}

function hasMissingDescription(item) {
  return isNullOrEmptyString(item.description);
}

function hasMissingPackages(item) {
  return isNullOrEmptyString(item.number_of_packages);
}

function wrongTypeForPackages(item) {
  // Check if number_of_packages is null, undefined, or an empty string
  if (isNullOrEmptyString(item.number_of_packages)) {
    return false;
  }

  const numberOfPackages = Number(item.number_of_packages);
  return isNaN(numberOfPackages) || numberOfPackages < 0;
}

function hasMissingNetWeight(item) {
  return isNullOrEmptyString(item.total_net_weight_kg);
}

function wrongTypeNetWeight(item) {
  // Check if total_net_weight_kg is null, undefined, or an empty string
  if (isNullOrEmptyString(item.total_net_weight_kg)) {
    return false;
  }

  const totalNetWeightKg = Number(item.total_net_weight_kg);
  return isNaN(totalNetWeightKg) || totalNetWeightKg < 0;
}

function removeEmptyItems(packingListItems) {
  const isNullOrUndefined = (entry) =>
    entry[0] === "row_location" || entry[1] === null || entry[1] === undefined;
  return packingListItems.filter(
    (x) => !Object.entries(x).every(isNullOrUndefined),
  );
}

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

function hasMissingNetWeightUnit(item) {
  return (
    isNullOrEmptyString(item.total_net_weight_unit) ||
    !regex.findUnit(item.total_net_weight_unit)
  );
}

function hasMissingNirms(item) {
  return isNullOrEmptyString(item.nirms);
}

function hasInvalidNirms(item) {
  return (
    !isNullOrEmptyString(item.nirms) &&
    !isNirms(item.nirms) &&
    !isNotNirms(item.nirms)
  );
}

function hasMissingCoO(item) {
  return isNirms(item.nirms) && isNullOrEmptyString(item.country_of_origin);
}

function hasInvalidCoO(item) {
  return isNirms(item.nirms) && isInvalidCoO(item.country_of_origin);
}

function hasHighRiskProducts(item) {
  return (
    isNirms(item.nirms) &&
    !isNullOrEmptyString(item.country_of_origin) &&
    !isInvalidCoO(item.country_of_origin) &&
    !isNullOrEmptyString(item.commodity_code) &&
    isHighRiskProducts(
      item.country_of_origin,
      item.commodity_code,
      item.type_of_treatment,
    )
  );
}

function isNirms(nirms) {
  if (typeof nirms !== "string") {
    return false;
  }
  const nirmsValues = ["yes", "nirms", "green", "y", "g"];
  return nirmsValues.includes(nirms.trim().toLowerCase());
}

function isNotNirms(nirms) {
  if (typeof nirms !== "string") {
    return false;
  }
  const notNirmsValues = ["no", "non-nirms", "non nirms", "red", "n", "r"];
  return notNirmsValues.includes(nirms.trim().toLowerCase());
}

function isInvalidCoO(countryOfOrigin) {
  if (isNullOrEmptyString(countryOfOrigin)) {
    return false;
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

function isValidIsoCode(code) {
  if (!code || typeof code !== "string") {
    return false;
  }
  const normalisedCode = code.toLowerCase();
  return isoCodesData.some(
    (isoCode) => isoCode.toLowerCase() === normalisedCode,
  );
}

// Checks if the combination exists in highRiskProductsData
function isHighRiskProducts(countryOfOrigin, commodityCode, typeOfTreatment) {
  return highRiskProductsData.some(
    (item) =>
      isCountryOfOriginMatching(countryOfOrigin, item.country_of_origin) &&
      commodityCode
        .toString()
        ?.toLowerCase()
        .startsWith(item.commodity_code?.toLowerCase()) &&
      isTreatmentTypeMatching(typeOfTreatment, item.type_of_treatment),
  );
}

// Helper function to check if country of origin matches (handles comma-separated values)
function isCountryOfOriginMatching(countryOfOrigin, highRiskCountryOfOrigin) {
  if (
    isNullOrEmptyString(countryOfOrigin) ||
    isNullOrEmptyString(highRiskCountryOfOrigin)
  ) {
    return false;
  }

  const normalizedCountry = countryOfOrigin.toLowerCase();
  const normalizedHighRiskCountry = highRiskCountryOfOrigin.toLowerCase();

  // Check if countryOfOrigin contains comma-separated values
  if (normalizedCountry.includes(",")) {
    const countryCodes = normalizedCountry.split(",");
    // Check if any of the country codes matches the high risk country
    return countryCodes.some(
      (code) => code.trim() === normalizedHighRiskCountry,
    );
  }

  // Single value case
  return normalizedCountry === normalizedHighRiskCountry;
}

// Helper function to check if treatment type matches
function isTreatmentTypeMatching(typeOfTreatment, highRiskTypeOfTreatment) {
  // If high risk treatment type or typeOfTreatment is not specified, skip the treatment type check
  if (
    isNullOrEmptyString(highRiskTypeOfTreatment) ||
    isNullOrEmptyString(typeOfTreatment)
  ) {
    return true;
  }

  return (
    highRiskTypeOfTreatment?.toLowerCase() === typeOfTreatment?.toLowerCase()
  );
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
  hasHighRiskProducts,
  isNirms,
  isNotNirms,
};
