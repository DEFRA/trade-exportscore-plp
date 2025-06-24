const regex = require("../../utilities/regex");

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

  const number_of_packages = Number(item.number_of_packages);
  return isNaN(number_of_packages) || number_of_packages < 0;
}

function hasMissingNetWeight(item) {
  return isNullOrEmptyString(item.total_net_weight_kg);
}

function wrongTypeNetWeight(item) {
  // Check if total_net_weight_kg is null, undefined, or an empty string
  if (isNullOrEmptyString(item.total_net_weight_kg)) {
    return false;
  }

  const total_net_weight_kg = Number(item.total_net_weight_kg);
  return isNaN(total_net_weight_kg) || total_net_weight_kg < 0;
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
  return isNullOrEmptyString(item.total_net_weight_unit) || !regex.findUnit(item.total_net_weight_unit);
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
};
