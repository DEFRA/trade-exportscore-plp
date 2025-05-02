function hasMissingIdentifier(item) {
  return !(
    (item.nature_of_products !== null && item.type_of_treatment !== null) ||
    item.commodity_code !== null
  );
}

function hasInvalidProductCode(item) {
  if (item.commodity_code === null || item.commodity_code === undefined) {
    return false;
  }
  return (
    item.commodity_code.toString().replace(/\s+/g, "").match(/^\d*$/) === null
  );
}

function hasMissingDescription(item) {
  return item.description === null;
}

function hasMissingPackages(item) {
  return (
    item.number_of_packages === null ||
    item.number_of_packages === undefined ||
    item.number_of_packages === ""
  );
}

function wrongTypeForPackages(item) {
  // Check if number_of_packages is null, undefined, or an empty string
  if (
    item.number_of_packages === null ||
    item.number_of_packages === undefined ||
    item.number_of_packages === ""
  ) {
    return false;
  }

  const number_of_packages = Number(item.number_of_packages);
  return isNaN(number_of_packages) || number_of_packages <= 0;
}

function hasMissingNetWeight(item) {
  return (
    item.total_net_weight_kg === null ||
    item.total_net_weight_kg === undefined ||
    item.total_net_weight_kg === ""
  );
}

function wrongTypeNetWeight(item) {
  // Check if total_net_weight_kg is null, undefined, or an empty string
  if (
    item.total_net_weight_kg === null ||
    item.total_net_weight_kg === undefined ||
    item.total_net_weight_kg === ""
  ) {
    return false;
  }

  const total_net_weight_kg = Number(item.total_net_weight_kg);
  return isNaN(total_net_weight_kg) || total_net_weight_kg <= 0;
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
};
