const { plDir } = require('../config')

const excelToJson = require('convert-excel-to-json')
const parserService = require('../services/parser-service')

const filename = plDir + 'test-packing-list.xlsx'
const result = excelToJson({
    sourceFile: filename
})

if (parserService.matchesAsda()) {
    console.log('Packling list matches Asda')
	//parsePackingList(packinglist, "Asda")
} else if (parserService.matchesBandM(result)) {
    console.log('Packling list matches BandM')
	//parsePacklingList(packingList, "BandM")
} else {
	console.log('failed to parse')
}

const combined = {
    result
  }

module.exports = {
    method: 'GET',
    path: '/non-ai',
    handler: (_request, h) => h.response(combined).code(200)
  }