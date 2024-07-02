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

function matchesSainsburys (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xlsx') return false

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1]?.N.replace(/\u200B/g, '')
    console.log(establishmentNumber)
    const regex = /^RMS-GB-000094-[0-9]{3}$/
    if (!regex.test(establishmentNumber)) return false

    // check for header values
    const header = {
      A: 'Delivery Date',
      B: 'Load Ref\r\n(Trailer Number)',
      C: 'Product Type / Category',
      D: 'Product / Part Number',
      E: 'Product / Part Number Description',
      F: 'Packed Singles',
      G: 'Packages',
      H: 'Net\r\nWeight / Package KG',
      I: 'Gross\r\nWeight / Package KG',
      J: 'Packaging Type',
      K: 'Excise Code',
      L: 'Final Destination ID',
      M: 'Dispatch Unit ID',
      N: 'RMS Number (based on depot)',
      O: 'Commodity Code'
    }

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) return false
    else return true
  } catch (err) {
    return false
  }
}

function parseSainsburys (packingListJson) {
  const establishmentNumber = packingListJson[1].N.replace(/\u200B/g, '')
  const packingListContents = packingListJson.slice(1).map(col => ({
    description: col.E,
    nature_of_products: col.C,
    type_of_treatment: null,
    commodity_code: col.O,
    number_of_packages: col.G,
    total_net_weight_kg: col.H
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function matchesTjmorris (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop().toLowerCase()
    if (fileExtension !== 'xls') return false

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1]?.A
    console.log(establishmentNumber)
    const regex = /^RMS-GB-000010-[0-9]{3}$/
    if (!regex.test(establishmentNumber)) return false

    // check for header values
    const header = {
      A: 'Consignor / Place o f Despatch',
      B: 'CONSIGNEE',
      C: 'Trailer',
      D: 'Seal',
      E: 'Store',
      F: 'STORENAME',
      G: 'Order',
      H: 'Cage/Ref',
      I: 'Group',
      J: 'TREATMENTTYPE',
      K: 'Sub-Group',
      L: 'Description',
      M: 'Item',
      N: 'Description',
      O: 'Tariff/Commodity',
      P: 'Cases',
      Q: 'Gross Weight Kg',
      R: 'Net Weight Kg',
      S: 'Cost',
      T: 'Country of Origin',
      U: 'VAT Status',
      V: 'SPS',
      W: 'Consignment ID',
      X: 'Processed?',
      Y: 'Created Timestamp'
    }

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) return false
    else return true
  } catch (err) {
    return false
  }
}

function parseTjmorris (packingListJson) {
  const establishmentNumber = packingListJson[1].A
  const packingListContents = packingListJson.slice(1).map(col => ({
    description: col.N,
    nature_of_products: col.L,
    type_of_treatment: col.J,
    commodity_code: col.O,
    number_of_packages: col.P,
    total_net_weight_kg: col.R
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

module.exports = {
  matchesBandM,
  matchesAsda,
  parseBandM,
  failedParser,
  combineParser,
  parseAsda,
  matchesSainsburys,
  parseSainsburys,
  matchesTjmorris,
  parseTjmorris
}
