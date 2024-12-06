const { hasMissingDescription,
    hasMissingIdentifier,
    hasMissingNetWeight,
    hasMissingPackages,
    wrongTypeForPackages,
    wrongTypeNetWeight } = require("./packing-list-validator-utilities");

function cleansePackingList(parsedPackingList) {
    parsedPackingList.items = removeEmptyItems(parsedPackingList.items);
    return parsedPackingList;
}

function removeEmptyItems(packingListItems) {
    const isNullOrUndefined = (value) => value === null || value === undefined;
    return packingListItems.filter(
        (x) => !Object.values(x).every(isNullOrUndefined),
    );
}

function validatePackingList(packingList) {
    const validationResult = validatePackingListByIndex(packingList);
    return generateFailuresByIndex(validationResult);
}

function validatePackingListByIndex(packingList) {
    // refactor slightly.  If no remos/items then don't go through items?
    const hasRemos = packingList.registration_approval_number !== null;
    const isEmpty = packingList.items.length === 0;
    const itemFailures =
        packingList.items.map((val, index) => {
            let result = {};
            if (hasMissingIdentifier(val)) result.missingIdentifier = true;
            if (hasMissingDescription(val)) result.missingDescription = true;
            if (hasMissingPackages(val)) result.missingPackages = true;
            if (wrongTypeForPackages(val)) result.wrongTypeForPackages = true;
            if (hasMissingNetWeight(val)) result.missingNetWeight = true;
            if (wrongTypeNetWeight(val)) result.wrongTypeForNetWeight = true;

            if (Object.keys(result).length !== 0) result.index = index;

            return result;
        }).filter(result => {
            return result.index != undefined
        });

    return {
        hasRemos,
        isEmpty,
        itemFailures,
        hasAllFields: (itemFailures.length === 0 && hasRemos) && !isEmpty
    };

}

function generateFailuresByIndex(validationResult) {
    let result = {
        hasAllFields: validationResult.hasAllFields
    }
    if (!validationResult.hasAllFields) {
        // build failure reason
        // refactor slightly.  If no remos/items then don't go through items?
        let failureReasons = "";
        if (validationResult.isEmpty) failureReasons = failureReasons.concat("The packing list had no data.  ");
        if (!validationResult.hasRemos) failureReasons = failureReasons.concat("Remos number missing.  ");
        if (validationResult.itemFailures.length > 0) failureReasons = failureReasons.concat(generateitemsFailureReasons(validationResult.itemFailures));

        result.failureReasons = failureReasons;

    }
    return result;
}

function generateitemsFailureReasons(items){
    const maxFailuresToShow = 2;
    if(items.length > maxFailuresToShow){
        let failureReasons = `There were ${items.length} failures.  First ${maxFailuresToShow} are...  `;
        return failureReasons = failureReasons.concat(
                                    items.slice(0, maxFailuresToShow)
                                         .reduce((prev, current) => prev.concat(generateitemFailureReasons(current)), "")
                                    );
    }
    else{
        return items.reduce((prev, current) => prev.concat(generateitemFailureReasons(current)),"");
    }
}

function generateitemFailureReasons(item){
    let failureDetails = `Failures for index: ${item.index}:  `;
    if(item.missingIdentifier) failureDetails += "Missing Identifier.  "; 
    if(item.missingDescription) failureDetails += "Missing Description.  "; 
    if(item.missingPackages) failureDetails += "Missing Packages.  "; 
    if(item.wrongTypeForPackages) failureDetails += "Wrong Type for Packages.  "; 
    if(item.missingNetWeight) failureDetails += "Missing Net weight.  "; 
    if(item.wrongTypeForNetWeight) failureDetails += "Wrong Type for Net Weight.  "; 
    return failureDetails;
}

module.exports = {
    cleansePackingList,
    validatePackingList,
};
