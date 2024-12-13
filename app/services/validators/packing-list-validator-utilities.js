function hasMissingIdentifier(item) {
  return !(
    (item.nature_of_products !== null && item.type_of_treatment !== null) ||
    item.commodity_code !== null
  );
}

function hasMissingDescription(item) {
  return item.description === null;
}

function hasMissingPackages(item) {
  return item.number_of_packages === null;
}

function wrongTypeForPackages(item) {
  return isNaN(Number(item.number_of_packages));
}

function hasMissingNetWeight(item) {
  return item.total_net_weight_kg === null;
}

function wrongTypeNetWeight(item) {
  return isNaN(Number(item.total_net_weight_kg));
}

function removeEmptyItems(packingListItems) {
  const isNullOrUndefined = (value) => value === null || value === undefined;
  return packingListItems.filter(
    (x) => !Object.values(x).every(isNullOrUndefined),
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
  hasMissingIdentifier,
  hasMissingNetWeight,
  hasMissingPackages,
  wrongTypeForPackages,
  wrongTypeNetWeight,
  removeEmptyItems,
  removeBadData,
};
