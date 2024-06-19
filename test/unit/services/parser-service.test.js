const parserService = require('../../../app/services/parser-service')

describe('matchesBandM', () => {
  test('returns true', () => {
    const filename = 'packinglist.xlsx'
    const packingListJson = {
      Sheet1: [
        {},
        {},
        {
          H: 'WAREHOUSE SCHEME NUMBER:',
          I: 'RMS-GB-000005-001'
        },
        {},
        {},
        {
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
      ]
    }
    const result = parserService.matchesBandM(packingListJson, filename)
    expect(result).toBeTruthy()
  })

  test('returns false for empty json', () => {
    const packingListJson = {}
    const filename = 'packinglist.xlsx'
    const result = parserService.matchesBandM(packingListJson, filename)
    expect(result).toBeFalsy()
  })

  test('returns false for missing establishment number', () => {
    const packingListJson = {
      Sheet1: [
        {},
        {},
        {
          H: 'WAREHOUSE SCHEME NUMBER:',
          I: 'INCORRECT'
        }
      ]
    }
    const filename = 'packinglist.xlsx'
    const result = parserService.matchesBandM(packingListJson, filename)
    expect(result).toBeFalsy()
  })

  test('return false for incorrect file extension', () => {
    const filename = 'packinglist.pdf'
    const packingListJson = {}
    const result = parserService.matchesBandM(packingListJson, filename)
    expect(result).toBeFalsy()
  })

  test('return false for incorrect header values', () => {
    const filename = 'packinglist.xlxs'
    const packingListJson = {
      Sheet1: [
        {},
        {},
        {
          H: 'WAREHOUSE SCHEME NUMBER:',
          I: 'RMS-GB-000005-001'
        },
        {},
        {},
        {
          A: 'NOT',
          B: 'CORRECT',
          C: 'HEADER'
        }
      ]
    }
    const result = parserService.matchesBandM(packingListJson, filename)
    expect(result).toBeFalsy()
  })
})

describe('parseBandM', () => {
  test('parses json', () => {
    const packingListJson = [
       {},
       {},
       {
         H: 'WAREHOUSE SCHEME NUMBER:',
         I: 'RMS-GB-000005-001'
       },
       {},
       {},
       {
         A: 'PRODUCT CODE (SHORT)',
         B: 'PRISM',
         C: 'ITEM DESCRIPTION',
         D: 'COMMODITY CODE',
         E: 'PLACE OF DISPATCH',
         F: 'TOTAL NUMBER OF CASES',
         G: 'NET WEIGHT',
         H: 'GROSS WEIGHT',
         I: 'ANIMAL ORIGIN'
       },
       {
         A: 412267,
         B: 10145600,
         C: 'J/L JERKY 70G TERIYAKI',
         D: 16025095,
         E: 'RMS-GB-000005-001',
         F: 1,
         G: 1.15,
         H: 1.28,
         I: 'YES'
       },
       {
         A: 351357,
         B: 10300700,
         C: 'MINI ROLLS 10PK',
         D: 19053199,
         E: 'RMS-GB-000005-001',
         F: 1,
         G: 3.27,
         H: 3.63,
         I: 'YES'
       },
       {
         D: ' '
       }
     ]
    const result = parserService.parseBandM(packingListJson)
    expect(result.registration_approval_number).toBe(packingListJson[2].I)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].description).toBe(packingListJson[6].C)
    expect(result.items[1].description).toBe(packingListJson[7].C)
    expect(result.items[0].commodity_code).toBe(packingListJson[6].D)
    expect(result.items[1].commodity_code).toBe(packingListJson[7].D)
    expect(result.items[0].number_of_packages).toBe(packingListJson[6].F)
    expect(result.items[1].number_of_packages).toBe(packingListJson[7].F)
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[6].G)
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[7].G)
  })
})

describe('failedParser', () => {
  test('parses json', () => {
    const packingListJson = {
      registration_approval_number: null,
      items: [],
      business_checks:
      {
        all_required_fields_present: false
      }
    }
    const result = parserService.failedParser()
    expect(result).toMatchObject(packingListJson)
    expect(result.registration_approval_number).toBeNull()
    expect(result.items).toMatchObject([])
    expect(result.business_checks.all_required_fields_present).toBeFalsy()
  })
})

describe('combineParser', () => {
  test('parses json', () => {
    const registrationApprovalNumber = 'test'
    const items = [{
      description: 'test desc',
      nature_of_products: 'products',
      type_of_treatment: 'teatment',
      commodity_code: 123,
      number_of_packages: 1,
      total_net_weight_kg: 1.2
    }]
    const packingListJson = {
      registration_approval_number: registrationApprovalNumber,
      items,
      business_checks:
      {
        all_required_fields_present: true
      }
    }
    const result = parserService.combineParser(registrationApprovalNumber, items, true)
    expect(result).toMatchObject(packingListJson)
  })
})

describe('matchesAsda', () => {
  test('returns true', () => {
    const filename = 'packinglist.xls'
    const packingListJson = {
      PackingList_Extract: [
        {
          A: '[Description Of All Retail Goods]',
          B: '[Nature Of Product]',
          C: '[Treatment Type]',
          D: '[Number Of Establishment]',
          E: '[Destination Store Establishment Number]',
          F: '[Number of Packages]',
          G: '[Net Weight]',
          H: '[kilograms/grams]'
        },
        {
          D: 'RMS-GB-000015-001'
        }
      ]
    }
    const result = parserService.matchesAsda(packingListJson, filename)
    expect(result).toBeTruthy()
  })

  test('returns false for empty json', () => {
    const packingListJson = {}
    const filename = 'packinglist.xls'
    const result = parserService.matchesAsda(packingListJson, filename)
    expect(result).toBeFalsy()
  })

  test('returns false for missing establishment number', () => {
    const packingListJson = {
      PackingList_Extract: [
        {},
        {},
        {
          I: 'INCORRECT'
        }
      ]
    }
    const filename = 'packinglist.xls'
    const result = parserService.matchesAsda(packingListJson, filename)
    expect(result).toBeFalsy()
  })

  test('return false for incorrect file extension', () => {
    const filename = 'packinglist.pdf'
    const packingListJson = {}
    const result = parserService.matchesAsda(packingListJson, filename)
    expect(result).toBeFalsy()
  })

  test('return false for incorrect header values', () => {
    const filename = 'packinglist.xls'
    const packingListJson = {
      PackingList_Extract: [
        {
          A: 'NOT',
          B: 'CORRECT',
          C: 'HEADER'
        },
        {
          D: 'RMS-GB-000015-001'
        }
      ]
    }
    const result = parserService.matchesAsda(packingListJson, filename)
    expect(result).toBeFalsy()
  })
})

describe('parseAsda', () => {
  test('parses json', () => {
    const packingListJson =
      [
        {
          A: '[Description Of All Retail Goods]',
          B: '[Nature Of Product]',
          C: '[Treatment Type]',
          D: '[Number Of Establishment]',
          E: '[Destination Store Establishment Number]',
          F: '[Number of Packages]',
          G: '[Net Weight]',
          H: '[kilograms/grams]'
        },
        {
          A: '169 STOREY TREEHOUSE',
          B: 'BOOKS',
          C: 'GM',
          D: 'RMS-GB-000015-006',
          E: 'RMS-NI-000008-017',
          F: 2,
          G: 0.3800,
          H: 'kgs'
        },
        {
          A: '19 CRIMES',
          B: 'WINES',
          C: 'AMBIENT',
          D: 'RMS-GB-000015-006',
          E: 'RMS-NI-000008-017',
          F: 1,
          G: 0.3457,
          H: 'kgs'
        }
      ]
    const result = parserService.parseAsda(packingListJson)
    expect(result.registration_approval_number).toBe(packingListJson[1].D)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].description).toBe(packingListJson[1].A)
    expect(result.items[1].description).toBe(packingListJson[2].A)
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].B)
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].B)
    expect(result.items[0].type_of_treatment).toBe(packingListJson[1].C)
    expect(result.items[1].type_of_treatment).toBe(packingListJson[2].C)
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].F)
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].F)
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].G)
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].G)
  })
})
