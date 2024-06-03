const parserService = require('../../../app/services/parser-service')

describe('matchesBandM', () => {
    test('should be true', () => {
        const result = parserService.matchesBandM()
        expect(result).toBeTruthy()
    })
})