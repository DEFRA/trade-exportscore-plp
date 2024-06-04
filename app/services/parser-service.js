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

function matchesAsda() {
    return false
}

module.exports = { matchesBandM, matchesAsda}