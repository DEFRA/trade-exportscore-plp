function hasMissingIdentifier(item) {
    return (item.nature_of_products === null && item.type_of_treatment === null) || item.commodity_code === null;
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

module.exports = {
    hasMissingDescription,
    hasMissingIdentifier,
    hasMissingNetWeight,
    hasMissingPackages,
    wrongTypeForPackages,
    wrongTypeNetWeight
}