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
}

let parsedPackingList = parserService.failedParser
if (parserService.matchesAsda()) {
  console.log('Packling list matches Asda')
} else if (parserService.matchesBandM(result.Sheet1, filename)) {
  console.log('Packling list matches BandM')
  parsedPackingList = parserService.parseBandM(result.Sheet1)
} else {
  console.log('failed to parse')
}

module.exports = {
  method: 'GET',
  path: '/non-ai',
  handler: (_request, h) => h.response(parsedPackingList).code(200)
}
