const parserService = require('../../../app/services/parser-service')

describe('matchesBandM', () => {
    test('returns true', () => {
        const filename = 'packinglist.xlsx'
        const packingListJson = [
            {},
            {},
            {
              I: "RMS-GB-000005-001",
            },
            {},
            {},
            {
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
          ]
        const result = parserService.matchesBandM(packingListJson, filename)
        expect(result).toBeTruthy()
    })

    test('returns false for empty json', () => {
        packingListJson = {}
        const filename = 'packinglist.xlsx'
        const result = parserService.matchesBandM(packingListJson, filename)
        expect(result).toBeFalsy()
    })

    test('returns false for missing establishment number', () => {
        const packingListJson = [
            {},
            {},
            {
              I: "INCORRECT"
            }
          ]
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
        const filename = 'packinglist.pdf'
        const packingListJson = [
            {},
            {},
            {
              I: "RMS-GB-000005-001",
            },
            {},
            {},
            {
              A: "NOT",
              B: "CORRECT",
              C: "HEADER"
            }
          ]
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
              I: "RMS-GB-000005-001",
            },
            {},
            {},
            {
              A: "PRODUCT CODE (SHORT)",
              B: "PRISM",
              C: "ITEM DESCRIPTION",
              D: "COMMODITY CODE",
              E: "PLACE OF DISPATCH",
              F: "TOTAL NUMBER OF CASES",
              G: "NET WEIGHT",
              H: "GROSS WEIGHT",
              I: "ANIMAL ORIGIN",
            },
            {
              A: 412267,
              B: 10145600,
              C: "J/L JERKY 70G TERIYAKI",
              D: 16025095,
              E: "RMS-GB-000005-001",
              F: 1,
              G: 1.15,
              H: 1.28,
              I: "YES",
            },
            {
              A: 351357,
              B: 10300700,
              C: "MINI ROLLS 10PK",
              D: 19053199,
              E: "RMS-GB-000005-001",
              F: 1,
              G: 3.27,
              H: 3.63,
              I: "YES",
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