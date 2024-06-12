function matchesBandM (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xlsx') return false

    // check for correct establishment number
    const traderRow = packingListJson.findIndex(x => x.H === 'WAREHOUSE SCHEME NUMBER:')
    const establishmentNumber = packingListJson[traderRow].I
    const regex = /^RMS-GB-000005-[0-9]{3}$/
    if (!regex.test(establishmentNumber)) return false

    // check for header values
    const headerRow = packingListJson.findIndex(x => x.B === 'PRISM')
    const header = {
      A: 'PRODUCT CODE (SHORT)',
      B: 'PRISM',
      C: 'ITEM DESCRIPTION',
      D: 'COMMODITY CODE',
      E: 'PLACE OF DISPATCH',
      F: 'TOTAL NUMBER OF CASES',
      G: 'NET WEIGHT',
      H: 'GROSS WEIGHT',
      I: 'ANIMAL ORIGIN'
    }
    if (JSON.stringify(packingListJson[headerRow]) !== JSON.stringify(header)) return false
    else return true
  } catch (err) {
    return false
  }
}

function matchesAsda () {
  return false
}

function parseBandM (packingListJson) {
  const traderRow = packingListJson.findIndex(x => x.H === 'WAREHOUSE SCHEME NUMBER:')
  const establishmentNumber = packingListJson[traderRow].I
  const headerRow = packingListJson.findIndex(x => x.B === 'PRISM')
  const lastRow = packingListJson.slice(headerRow + 1).findIndex(x => Number.isInteger(x.D) === false) + headerRow
  console.log(lastRow)
  const packingListContents = packingListJson.slice(headerRow + 1, lastRow + 1).map(col => ({
    description: col.C,
    nature_of_products: null,
    type_of_treatment: null,
    commodity_code: col.D,
    number_of_packages: col.F,
    total_net_weight_kg: col.G
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function combineParser (establishmentNumber, packingListContents, allRequiredFieldsPresent) {
  return {
    registration_approval_number: establishmentNumber,
    items: packingListContents,
    business_checks:
    {
      all_required_fields_present: allRequiredFieldsPresent
    }
  }
}

function failedParser () {
  return combineParser(null, null, false)
}

module.exports = { matchesBandM, matchesAsda, parseBandM, failedParser, combineParser }
