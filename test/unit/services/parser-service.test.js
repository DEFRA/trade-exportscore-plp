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