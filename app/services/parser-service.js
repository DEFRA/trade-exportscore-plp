function matchesBandM(packingListJson, filename) {
    try {
        // check for correct extension
        const fileExtension = filename.split('.').pop()
        if (fileExtension != 'xlsx') return false

        // check for correct establishment number
        const establishmentNumber = packingListJson[2].I
        const regex = new RegExp('^RMS-GB-000005-[0-9]{3}$')
        if (!regex.test(establishmentNumber)) return false

        // check for header values
        const headerRow = packingListJson.findIndex(x => x.B == 'PRISM')
        const header = {
            A: "PRODUCT CODE (SHORT)",
            B: "PRISM",
            C: "ITEM DESCRIPTION",
            D: "COMMODITY CODE",
            E: "PLACE OF DISPATCH",
            F: "TOTAL NUMBER OF CASES",
            G: "NET WEIGHT",
            H: "GROSS WEIGHT",
            I: "ANIMAL ORIGIN",
          }
        if (JSON.stringify(packingListJson[headerRow]) != JSON.stringify(header)) return false
        else return true
    }
    catch(err) {
        return false
    }
}

function matchesAsda(packingListJson, filename) {
    try {
        // check for correct extension
        const fileExtension = filename.split('.').pop()
        if (fileExtension != 'xls') return false

        // check for correct establishment number
        const establishmentNumber = packingListJson[2].I
        const regex = new RegExp('^RMS-GB-000015-[0-9]{3}$')
        if (!regex.test(establishmentNumber)) return false

        // check for header values //write
        const header = {
            A: "[Description Of All Retail Goods]",
            B: "[Nature Of Product]",
            C: "[Treatment Type]",
            D: "[Number Of Establishment]",
            E: "[Destination Store Establishment Number]",
            F: "[Number of Packages]",
            G: "[Weight]",
            H: "[kilograms/grams]",
            I: ""
        };
        
        if (JSON.stringify(packingListJson[1]) != JSON.stringify(header)) return false;

    }
    catch(err) {
        return false
    }
}

function parseBandM(packingListJson) {
    const establishmentNumber = packingListJson[2].I
    const headerRow = packingListJson.findIndex(x => x.B == 'PRISM')
    const packingListContents = packingListJson.slice(headerRow + 1, packingListJson.length).map(col => ({
        description: col.C,
        nature_of_products: "",
        type_of_treatment: "",
        commodity_code: col.D,
        number_of_packages: col.F,
        total_net_weight_kg: col.G
      }))

    const combined = {
        registration_approval_number: establishmentNumber,
        items: packingListContents
        }

    return combined
}

function parseAsda(packingListJson) {
    const registration_approval_number = packingListJson[1].D; 

    const packingListContents = packingListJson.slice(1).map(row => ({
        description: row.A,
        nature_of_product: row.B,
        treatment_type: row.C,
        number_of_packages: row.F,
        total_net_weight_kg: row.G
    }));

    const combined = {  
        remos_number: registration_approval_number,
        items: packingListContents
    };

    return combined;
}

module.exports = { matchesBandM, matchesAsda, parseBandM, parseAsda}
