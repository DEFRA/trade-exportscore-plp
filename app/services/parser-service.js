const MatcherResult = require('../services/matches-result')

const CUSTOMER_ORDER = 'Customer Order'
const COUNTRY_OF_ORIGIN = 'Country of Origin'
const INPUT_DATA_SHEET = 'Input Data Sheet'

function findParser (result, filename) {
  let parsedPackingList = failedParser()
  let isParsed = false

  if (matchesTjmorris(result, filename) === MatcherResult.CORRECT) {
    console.info('Packing list matches TJ Morris with filename: ', filename)
    parsedPackingList = parseTjmorris(result.Sheet1)
    isParsed = true
  } else if (matchesAsda(result, filename) === MatcherResult.CORRECT) {
    console.info('Packing list matches Asda with filename: ', filename)
    parsedPackingList = parseAsda(result.PackingList_Extract)
    isParsed = true
  } else if (matchesSainsburys(result, filename) === MatcherResult.CORRECT) {
    console.info('Packing list matches Sainsburys with filename: ', filename)
    parsedPackingList = parseSainsburys(result.Sheet1)
    isParsed = true
  } else if (matchesBandM(result, filename) === MatcherResult.CORRECT) {
    console.info('Packing list matches BandM with filename: ', filename)
    parsedPackingList = parseBandM(result.Sheet1)
    isParsed = true
  } else if (matchesTescoModel1(result, filename) === MatcherResult.CORRECT) {
    console.info('Packing list matches Tesco Model 1 with filename: ', filename)
    parsedPackingList = parseTescoModel1(result[INPUT_DATA_SHEET])
    isParsed = true
  } else if (matchesTescoModel2(result, filename) === MatcherResult.CORRECT) {
    console.info('Packing list matches Tesco Model 2 with filename: ', filename)
    parsedPackingList = parseTescoModel2(result.Sheet2)
    isParsed = true
  } else if (matchesFowlerWelch(result, filename) === MatcherResult.CORRECT) {
    console.info('Packing list matches Fowler Welch with filename: ', filename)
    parsedPackingList = parseFowlerWelch(result[CUSTOMER_ORDER])
    isParsed = true
  } else if (matchesNisa(result, filename) === MatcherResult.CORRECT) {
    console.info('Packing list matches Nisa with filename: ', filename)
    parsedPackingList = parseNisa(result[Object.keys(result)[0]])
    isParsed = true
  } else {
    console.info('Failed to parse packing list with filename: ', filename)
  }

  if (isParsed) {
    parsedPackingList.items = parsedPackingList.items.filter(x => !(x.description === null &&
      x.nature_of_products === null &&
      x.type_of_treatment === null &&
      x.commodity_code === null &&
      x.number_of_packages === null &&
      x.total_net_weight_kg === null))

    parsedPackingList.business_checks.all_required_fields_present = checkRequiredData(parsedPackingList)
  }

  return { packingList: parsedPackingList, isParsed }
}

function matchesBandM (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xlsx') { return MatcherResult.WRONG_EXTENSIONS }

    // check for correct establishment number
    const traderRow = packingListJson.Sheet1.findIndex(x => x.H === 'WAREHOUSE SCHEME NUMBER:')
    const establishmentNumber = packingListJson.Sheet1[traderRow].I
    const regex = /^RMS-GB-000005-\d{3}$/
    if (!regex.test(establishmentNumber)) { return MatcherResult.WRONG_ESTABLISHMENT_NUMBER }

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
    if (JSON.stringify(packingListJson.Sheet1[headerRow]) !== JSON.stringify(header)) { return MatcherResult.WRONG_HEADER } else { return MatcherResult.CORRECT }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR
  }
}

function matchesAsda (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xls') { return MatcherResult.WRONG_EXTENSIONS }

    // check for correct establishment number
    const establishmentNumber = packingListJson.PackingList_Extract[1].D
    const regex = /^RMS-GB-000015-\d{3}$/
    if (!regex.test(establishmentNumber)) { return MatcherResult.WRONG_ESTABLISHMENT_NUMBER }

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

    if (JSON.stringify(packingListJson.PackingList_Extract[0]) !== JSON.stringify(header)) { return MatcherResult.WRONG_HEADER } else { return MatcherResult.CORRECT }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR
  }
}

function matchesTescoModel1 (packingListJson, filename) {
  const establishmentNumberRow = 3
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xlsx') { return MatcherResult.WRONG_EXTENSIONS }

    // check for correct establishment number
    const establishmentNumber = packingListJson[INPUT_DATA_SHEET][establishmentNumberRow].AT
    const regex = /^RMS-GB-000022-\d{3}$/
    if (!regex.test(establishmentNumber)) { return MatcherResult.WRONG_ESTABLISHMENT_NUMBER }

    // check for header values
    const header = {
      G: 'Product/ Part Number description',
      L: 'Tariff Code UK',
      AS: 'Treatment Type',
      AT: 'Green Lane',
      BR: 'Packages',
      BT: 'Gross Weight',
      BU: 'Net Weight'
    }

    for (const key in header) {
      if (!packingListJson[INPUT_DATA_SHEET][4] || packingListJson[INPUT_DATA_SHEET][4][key] !== header[key]) {
        return MatcherResult.WRONG_HEADER
      }
    }

    return MatcherResult.CORRECT
  } catch (err) {
    return MatcherResult.GENERIC_ERROR
  }
}

function matchesTescoModel2 (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xlsx') { return MatcherResult.WRONG_EXTENSIONS }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet2[2].M
    const regex = /^RMS-GB-000015-\d{3}$/
    if (!regex.test(establishmentNumber)) { return MatcherResult.WRONG_ESTABLISHMENT_NUMBER }

    // check for header values
    const header = {
      A: 'Item',
      B: 'Product code',
      C: 'Commodity code',
      D: 'Online Check',
      E: 'Meursing code',
      F: 'Description of goods',
      G: COUNTRY_OF_ORIGIN,
      H: 'No. of pkgs',
      I: 'Type of pkgs',
      J: 'Total Gross Weight',
      K: 'Total Net Weight',
      L: 'Total Line Value',
      M: 'GB Establishment RMS Number'
    }

    if (JSON.stringify(packingListJson.Sheet2[0]) !== JSON.stringify(header)) { return MatcherResult.WRONG_HEADER } else { return MatcherResult.CORRECT }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR
  }
}

function parseBandM (packingListJson) {
  const traderRow = packingListJson.findIndex(x => x.H === 'WAREHOUSE SCHEME NUMBER:')
  const establishmentNumber = packingListJson[traderRow].I ?? null
  const headerRow = packingListJson.findIndex(x => x.B === 'PRISM')
  const lastRow = packingListJson.slice(headerRow + 1).findIndex(x => isEndOfRow(x)) + headerRow
  const packingListContents = packingListJson.slice(headerRow + 1, lastRow + 1).map(col => ({
    description: col.C ?? null,
    nature_of_products: null,
    type_of_treatment: null,
    commodity_code: col.D ?? null,
    number_of_packages: col.F ?? null,
    total_net_weight_kg: col.G ?? null
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function isEndOfRow (x) {
  const isTotal = (x.F !== null) && (x.G !== null) && (x.H !== null)
  const isEmpty = (x.A === ' ') && (x.B === ' ') && (x.C === ' ') && (x.D === ' ') && (x.E === ' ')
  return isTotal && isEmpty
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
  const establishmentNumber = packingListJson[1].D ?? null
  const packingListContents = packingListJson.slice(1).map(col => ({
    description: col.A ?? null,
    nature_of_products: col.B ?? null,
    type_of_treatment: col.C ?? null,
    commodity_code: null,
    number_of_packages: col.F ?? null,
    total_net_weight_kg: col.G ?? null
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function parseTescoModel1 (packingListJson) {
  const packingListContentsRow = 5
  const establishmentNumberRow = 3
  const establishmentNumber = packingListJson[establishmentNumberRow].AT ?? null
  const packingListContents = packingListJson.slice(packingListContentsRow).map(col => ({
    description: col.G ?? null,
    nature_of_products: null,
    type_of_treatment: col.AS ?? null,
    commodity_code: col.L ?? null,
    number_of_packages: col.BR ?? null,
    total_net_weight_kg: col.BU ?? null
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function parseTescoModel2 (packingListJson) {
  const establishmentNumber = packingListJson[2].M ?? null
  const packingListContents = packingListJson.slice(2).map(col => ({
    description: col.F ?? null,
    nature_of_products: null,
    type_of_treatment: null,
    commodity_code: col.C ?? null,
    number_of_packages: col.H ?? null,
    total_net_weight_kg: col.K ?? null
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function matchesSainsburys (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xlsx') { return MatcherResult.WRONG_EXTENSIONS }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1]?.N.replace(/\u200B/g, '')
    const regex = /^RMS-GB-000094-\d{3}$/
    if (!regex.test(establishmentNumber)) { return MatcherResult.WRONG_ESTABLISHMENT_NUMBER }

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

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) { return MatcherResult.WRONG_HEADER } else { return MatcherResult.CORRECT }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR
  }
}

function parseSainsburys (packingListJson) {
  const establishmentNumber = packingListJson[1].N?.replace(/\u200B/g, '') ?? null
  const packingListContents = packingListJson.slice(1).map(col => ({
    description: col.E ?? null,
    nature_of_products: col.C ?? null,
    type_of_treatment: null,
    commodity_code: col.O ?? null,
    number_of_packages: col.G ?? null,
    total_net_weight_kg: col.H ?? null
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function matchesTjmorris (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop().toLowerCase()
    if (fileExtension !== 'xls') { return MatcherResult.WRONG_EXTENSIONS }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1]?.A
    const regex = /^RMS-GB-000010-\d{3}$/
    if (!regex.test(establishmentNumber)) { return MatcherResult.WRONG_ESTABLISHMENT_NUMBER }

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
      T: COUNTRY_OF_ORIGIN,
      U: 'VAT Status',
      V: 'SPS',
      W: 'Consignment ID',
      X: 'Processed?',
      Y: 'Created Timestamp'
    }

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) { return MatcherResult.WRONG_HEADER } else { return MatcherResult.CORRECT }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR
  }
}

function parseTjmorris (packingListJson) {
  const establishmentNumber = packingListJson[1].A ?? null
  const packingListContents = packingListJson.slice(1).map(col => ({
    description: col.N ?? null,
    nature_of_products: col.L ?? null,
    type_of_treatment: col.J ?? null,
    commodity_code: col.O ?? null,
    number_of_packages: col.P ?? null,
    total_net_weight_kg: col.R ?? null
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function matchesFowlerWelch (packingListJson, filename) {
  try {
    const headerRowNumber = 44
    const establishmentNumberRow = 45
    // check for correct extension
    const fileExtension = filename.split('.').pop().toLowerCase()
    if (fileExtension !== 'xlsx') { return MatcherResult.WRONG_EXTENSIONS }

    // check for correct establishment number
    const establishmentNumber = packingListJson[CUSTOMER_ORDER][establishmentNumberRow].M
    const regex = /^RMS-GB-000216-\d{3}$/
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER
    }

    // check for header values
    const header = {
      A: 'Item',
      B: 'Product code',
      C: 'Commodity code',
      D: 'Online Check',
      E: 'Meursing code',
      F: 'Description of goods',
      G: COUNTRY_OF_ORIGIN,
      H: 'No. of pkgs ',
      I: 'Type of pkgs',
      J: 'Total Gross Weight',
      K: 'Total Net Weight',
      L: 'Total Line Value',
      M: 'NIIRMS Dispatch number',
      N: 'Treatment Type (Chilled /Ambient)',
      O: 'NIRMS Lane (R/G)',
      P: 'Secondary Qty',
      Q: 'Cert Type Req',
      R: 'Cert Number'
    }

    const originalHeader = packingListJson[CUSTOMER_ORDER][headerRowNumber]

    for (const key in header) {
      if (!originalHeader[key].startsWith(header[key])) {
        return MatcherResult.WRONG_HEADER
      }
    }
    return MatcherResult.CORRECT
  } catch (err) {
    return MatcherResult.GENERIC_ERROR
  }
}

function parseFowlerWelch (packingListJson) {
  const establishmentNumberRow = 45
  const establishmentNumber = packingListJson[establishmentNumberRow].M ?? null
  const packingListContents = packingListJson.slice(establishmentNumberRow).map(col => ({
    description: col.F ?? null,
    nature_of_products: null,
    type_of_treatment: col.N ?? null,
    commodity_code: col.C ?? null,
    number_of_packages: col.H ?? null,
    total_net_weight_kg: col.K ?? null
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function matchesNisa (packingListJson, filename) {
  const establishmentNumberRow = 1
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop()
    if (fileExtension !== 'xlsx') { return MatcherResult.WRONG_EXTENSIONS }

    // check for correct establishment number
    const sheet = Object.keys(packingListJson)[0]
    const establishmentNumber = packingListJson[sheet][establishmentNumberRow].A
    const regex = /^RMS-GB-000025-\d{3}$/
    if (!regex.test(establishmentNumber)) { return MatcherResult.WRONG_ESTABLISHMENT_NUMBER }

    // check for header values
    const header = {
      A: 'RMS_ESTABLISHMENT_NO',
      I: 'PRODUCT_TYPE_CATEGORY',
      K: 'PART_NUMBER_DESCRIPTION',
      L: 'TARIFF_CODE_EU',
      M: 'PACKAGES',
      O: 'NET_WEIGHT_TOTAL'
    }

    for (const key in header) {
      if (!packingListJson[sheet][0] || packingListJson[sheet][0][key] !== header[key]) {
        return MatcherResult.WRONG_HEADER
      }
    }

    return MatcherResult.CORRECT
  } catch (err) {
    return MatcherResult.GENERIC_ERROR
  }
}

function parseNisa (packingListJson) {
  const establishmentNumber = packingListJson[1].A ?? null
  const packingListContents = packingListJson.slice(1).map(col => ({
    description: col.K ?? null,
    nature_of_products: col.I ?? null,
    type_of_treatment: null,
    commodity_code: col.L ?? null,
    number_of_packages: col.M ?? null,
    total_net_weight_kg: col.O ?? null
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function checkRequiredData (packingList) {
  const hasCommodityCode = packingList.items.every(x => x.commodity_code !== null)
  const hasTreatmentOrNature = packingList.items.every(x => (x.nature_of_products !== null && x.type_of_treatment !== null))
  const hasDescription = packingList.items.every(x => x.description !== null)
  const hasPackages = packingList.items.every(x => x.number_of_packages !== null)
  const hasNetWeight = packingList.items.every(x => x.total_net_weight_kg !== null)
  const hasRemos = packingList.registration_approval_number !== null
  return ((hasCommodityCode || hasTreatmentOrNature) && hasDescription && hasPackages && hasNetWeight && hasRemos)
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
  parseTjmorris,
  matchesTescoModel1,
  matchesTescoModel2,
  parseTescoModel1,
  parseTescoModel2,
  matchesFowlerWelch,
  parseFowlerWelch,
  findParser,
  matchesNisa,
  parseNisa,
  checkRequiredData
}
