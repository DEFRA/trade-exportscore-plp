function cleansePackingList(parsedPackingList) {
    parsedPackingList.items = removeEmptyItems(parsedPackingList.items);
    parsedPackingList.items = removeBadData(parsedPackingList.items);
    return parsedPackingList;
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
function validatePackingList(packingList) {
    const validationResult = validatePackingListByIndex(packingList);
    return generateFailuresByIndex(validationResult);
}

function validatePackingListByIndex(packingList) {
    const hasRemos = packingList.registration_approval_number !== null;
    const isEmpty = packingList.items.length === 0;
    const itemFailures = 
        packingList.items.map((val, index) =>{
            let result = {};
            if(hasMissingIdentifier(val)) result.missingIdentifier = true;
            if(hasMissingDescription(val)) result.missingDescription = true;
            if(hasMissingPackages(val)) result.missingPackages = true;
            if(wrongTypeForPackages(val)) result.wrongTypeForPackages = true;
            if(hasMissingNetWeight(val)) result.missingNetWeight = true;
            if(wrongTypeNetWeight(val)) result.wrongTypeForNetWeight = true;

            if(Object.keys(result).length !== 0)result.index = index;

            return result;
        }).filter(result => {
return             result.index != undefined
});

    return {
        hasRemos,
        isEmpty,
        itemFailures,
        hasAllFields: (itemFailures.length === 0 && hasRemos) && ! isEmpty
    };

}

function generateFailuresByIndex(validationResult){
    let result ={
        hasAllFields: validationResult.hasAllFields
    }
    if (!validationResult.hasAllFields) {
        // build failure reason
        let failureReasons = "";
        if (validationResult.isEmpty) failureReasons += "The packing list had no data.  ";
        if (!validationResult.hasRemos) failureReasons += "Remos number missing.  ";
        if (validationResult.itemFailures.length > 0) failureReasons += "Missing packages";
        
        result.failureReasons = failureReasons;

    }
    return result;
}

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

function validatePackingListByIndexAndType(packingList) {

    const missingIdentifier = getMissingitems(
        packingList.items,
        hasMissingIdentifier
    )
    const missingDescription = getMissingitems(
        packingList.items,
        hasMissingDescription
    );
    const missingPackages = getMissingitems(
        packingList.items,
        hasMissingPackages
    );
    const missingNetWeight = getMissingitems(
        packingList.items,
        hasMissingNetWeight
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

function generateFailuresByIndexAndTypes(validationResult) {
    if (validationResult.hasAllFields) {
        return {
            hasAllFields: true
        };
    }
    else {
        // build failure reason
        let failureReasons;
        if (validationResult.isEmpty) failureReasons = "The packing list had no data";
        if (validationResult.missingPackages.length > 0) failureReasons = "Missing packages";

        return {
            hasAllFields: false,
            failureReasons
        };
    }
}

module.exports = {
    cleansePackingList,
    validatePackingList,
};
