const { plDir } = require('../config')

const excelToJson = require('convert-excel-to-json')
const parserService = require('../services/parser-service')

const filename = plDir + 'test-packing-list.xlsx'

let result = {}
try {
  result = excelToJson({
    sourceFile: filename
  })
} catch (err) {
  console.log(err)


var parsedPackingList;
if (parserService.matchesAsda()) {
    console.log('Packling list matches Asda')
} else if (parserService.matchesBandM(result.Sheet1, filename)) {
    console.log('Packling list matches BandM')
	parsedPackingList = parserService.parseBandM(result.Sheet1)
} else {
	console.log('failed to parse')
    parsedPackingList = parserService.failedParser()
>>>>>>> cd84b94 (add try catch for reading excel)
}

let parsedPackingList
if (parserService.matchesAsda()) {
  console.log('Packling list matches Asda')
} else if (parserService.matchesBandM(result.Sheet1, filename)) {
  console.log('Packling list matches BandM')
  parsedPackingList = parserService.parseBandM(result.Sheet1)
} else {
  console.log('failed to parse')
  parsedPackingList = parserService.failedParser()
}

module.exports = {
  method: 'GET',
  path: '/non-ai',
  handler: (_request, h) => h.response(parsedPackingList).code(200)
}
