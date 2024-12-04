function cleansePackingList(parsedPackingList){
    parsedPackingList.items = removeEmptyItems(parsedPackingList.items);
    parsedPackingList.items = removeBadData(parsedPackingList.items);
    return parsedPackingList;
}

function removeEmptyItems(packingListItems){
    const isNullOrUndefined = (value) => value === null || value === undefined;
    return packingListItems.filter(
        (x) => !Object.values(x).every(isNullOrUndefined),
    );
}

function removeBadData(packingListItems) {
    for (const x of packingListItems) {
        if (isNaN(Number(x.number_of_packages))) {
            x.number_of_packages = null;
        }
        if (isNaN(Number(x.total_net_weight_kg))) {
            x.total_net_weight_kg = null;
        }
    }
    return packingListItems;
}
function validatePackingList(packingList) {
    const validationResult = validatePackingListByIndexAndType(packingList);
    return generateFailuresByIndexAndTypes(validationResult);
}

function validatePackingListByIndexAndType(packingList) {

    const missingIdentifier = getMissingitems(
        packingList.items,
        (val) => (val.nature_of_products === null && val.type_of_treatment === null) || val.commodity_code === null
    )
    const missingDescription = getMissingitems(
        packingList.items,
        (val) => val.description === null
    );
    const missingPackages  = getMissingitems(
        packingList.items,
        (val) => val.number_of_packages === null
    );
    const missingNetWeight  = getMissingitems(
        packingList.items,
        (val) => val.total_net_weight_kg === null 
    );
    const hasRemos = packingList.registration_approval_number !== null;
    const isEmpty = packingList.items.length === 0;
    return {
        missingIdentifier,
        missingDescription,
        missingPackages,
        missingNetWeight,
        hasRemos,
        isEmpty,
        hasAllFields:
            (missingIdentifier.length === 0 &&
                missingDescription.length === 0 &&
                missingPackages.length === 0 &&
                missingNetWeight.length === 0 &&
                hasRemos) &&
            !isEmpty,
    };
}

function getMissingitems(items, fn) {
    return items
        .map((val, index) => (fn(val) ? index : null))
        .filter((val) => val !== null);
}

function generateFailuresByIndexAndTypes(validationResult){
    if(validationResult.hasAllFields)
    {
        return {
            hasAllFields:true
        };
    }
    else{
        // build failure reason
        let failureReasons;
        if(validationResult.isEmpty) failureReasons = "The packing list had no data";
        if(validationResult.missingPackages.length > 0) failureReasons = "Missing packages";

        return {
            hasAllFields:false,
            failureReasons
        };
    }
}

module.exports = {
    cleansePackingList,
    validatePackingList,
};
