function matchesBandM (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xlsx') return false

    // check for correct establishment number
    const traderRow = packingListJson.Sheet1.findIndex(x => x.H === 'WAREHOUSE SCHEME NUMBER:')
    const establishmentNumber = packingListJson.Sheet1[traderRow].I
    const regex = /^RMS-GB-000005-[0-9]{3}$/
    if (!regex.test(establishmentNumber)) return false

    // check for header values
    const headerRow = packingListJson.Sheet1.findIndex(x => x.B === 'PRISM')
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
    if (JSON.stringify(packingListJson.Sheet1[headerRow]) !== JSON.stringify(header)) return false
    else return true
  } catch (err) {
    return false
  }
}

function matchesAsda (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xls') return false

    // check for correct establishment number
    const establishmentNumber = packingListJson.PackingList_Extract[1].D
    const regex = /^RMS-GB-000015-[0-9]{3}$/
    if (!regex.test(establishmentNumber)) return false

    // check for header values
    const header = {
      A: '[Description Of All Retail Goods]',
      B: '[Nature Of Product]',
      C: '[Treatment Type]',
      D: '[Number Of Establishment]',
      E: '[Destination Store Establishment Number]',
      F: '[Number of Packages]',
      G: '[Net Weight]',
      H: '[kilograms/grams]'
    }

    if (JSON.stringify(packingListJson.PackingList_Extract[0]) !== JSON.stringify(header)) return false
    else return true
  } catch (err) {
    return false
  }
}

function parseBandM (packingListJson) {
  const traderRow = packingListJson.findIndex(x => x.H === 'WAREHOUSE SCHEME NUMBER:')
  const establishmentNumber = packingListJson[traderRow].I
  const headerRow = packingListJson.findIndex(x => x.B === 'PRISM')
  const lastRow = packingListJson.slice(headerRow + 1).findIndex(x => Number.isInteger(x.D) === false) + headerRow
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
  return combineParser(null, [], false)
}

function parseAsda (packingListJson) {
  const establishmentNumber = packingListJson[1].D
  const packingListContents = packingListJson.slice(1).map(col => ({
    description: col.A,
    nature_of_products: col.B,
    type_of_treatment: col.C,
    commodity_code: null,
    number_of_packages: col.F,
    total_net_weight_kg: col.G
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

module.exports = { matchesBandM, matchesAsda, parseBandM, failedParser, combineParser, parseAsda }
