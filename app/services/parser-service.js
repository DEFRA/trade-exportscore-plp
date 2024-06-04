function matchesBandM(packingListJson, filename) {
    try {
        // check for correct extension
        const fileExtension = filename.split('.').pop()
        if (fileExtension != 'xlsx') return false

        // check for correct establishment number
        const traderRow = packingListJson.findIndex(x => x.H == 'WAREHOUSE SCHEME NUMBER:')
        const establishmentNumber = packingListJson[traderRow].I
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

function matchesAsda() {
    return false
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

module.exports = { matchesBandM, matchesAsda, parseBandM}