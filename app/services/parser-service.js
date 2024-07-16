const MatcherResult = require('../services/matches-result')

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
    parsedPackingList = parseTescoModel1(result.Input_Data_Sheet)
    isParsed = true
  } else if (matchesTescoModel2(result, filename) === MatcherResult.CORRECT) {
    console.info('Packing list matches Tesco Model 2 with filename: ', filename)
    parsedPackingList = parseTescoModel2(result.Sheet2)
    isParsed = true
  } else {
    console.info('Failed to parse packing list with filename: ', filename)
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
    const establishmentNumber = packingListJson.Input_Data_Sheet[establishmentNumberRow].AT
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
      if (!packingListJson.Input_Data_Sheet[4] || packingListJson.Input_Data_Sheet[4][key] !== header[key]) {
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
      G: 'Country of Origin',
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

function parseTescoModel1 (packingListJson) {
  const packingListContentsRow = 5
  const establishmentNumber = packingListJson[4].AT
  const packingListContents = packingListJson.slice(packingListContentsRow).map(col => ({
    description: col.G,
    nature_of_products: null,
    type_of_treatment: col.AS,
    commodity_code: col.L,
    number_of_packages: col.BR,
    total_net_weight_kg: col.BU
  }))

  return combineParser(establishmentNumber, packingListContents, true)
}

function parseTescoModel2 (packingListJson) {
  const establishmentNumber = packingListJson[2].M
  const packingListContents = packingListJson.slice(2).map(col => ({
    description: col.F,
    nature_of_products: null,
    type_of_treatment: null,
    commodity_code: col.C,
    number_of_packages: col.H,
    total_net_weight_kg: col.K
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
      T: 'Country of Origin',
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

function matchesFowlerWelch (packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split('.').pop().toLowerCase()
    if (fileExtension !== 'xlsx') { return MatcherResult.WRONG_EXTENSIONS }

    // check for correct establishment number
    const establishmentNumber = packingListJson['Customer Order'][45].M
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
      G: 'Country of Origin',
      H: 'No. of pkgs \r\n(1547)',
      I: 'Type of pkgs',
      J: 'Total Gross Weight \r\n(11015.700kgs)',
      K: 'Total Net Weight \r\n(7921.700kgs)',
      L: 'Total Line Value \r\n(41662.4)',
      M: 'NIIRMS Dispatch number',
      N: 'Treatment Type (Chilled /Ambient)',
      O: 'NIRMS Lane (R/G)',
      P: 'Secondary Qty',
      Q: 'Cert Type Req',
      R: 'Cert Number'
    }

    const normalize = (str) => str.replace(/\(\d+(\.\d+)?[a-zA-Z]*\)/g, '(*)') 

    const originalHeader = packingListJson['Customer Order'][44]
    for (const key in header) {
      if (normalize(header[key]) !== normalize(originalHeader[key])) {
        return MatcherResult.WRONG_HEADER
      }
    }
    return MatcherResult.CORRECT
  } catch (err) {
    return MatcherResult.GENERIC_ERROR
  }
}

function parseFowlerWelch (packingListJson) {
  const establishmentNumber = packingListJson[45].M
  const packingListContents = packingListJson.slice(45).map(col => ({
    description: col.F,
    nature_of_products: null,
    type_of_treatment: col.N,
    commodity_code: col.C,
    number_of_packages: col.H,
    total_net_weight_kg: col.K
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
  parseTjmorris,
  matchesTescoModel1,
  matchesTescoModel2,
  parseTescoModel1,
  parseTescoModel2,
  matchesFowlerWelch,
  parseFowlerWelch,
  findParser
}
