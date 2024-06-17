const { plDir } = require('../config')

const excelToJson = require('convert-excel-to-json')
const parserService = require('../services/parser-service')

const filename = plDir + 'PackingList_Extract1.xls'
let result = {}
try {
  result = excelToJson({
    sourceFile: filename
  })
} catch (err) {
  console.log(err)
}
let parsedPackingList = parserService.failedParser()
console.log(parsedPackingList)
if (parserService.matchesAsda(result.PackingList_Extract, filename)) {
  console.log('Packing list matches Asda')
  parsedPackingList = parserService.parseAsda(result.PackingList_Extract)
} else if (parserService.matchesBandM(result.Sheet1, filename)) {
  console.log('Packing list matches BandM')
  parsedPackingList = parserService.parseBandM(result.Sheet1)
} else {
  console.log('failed to parse')
}

module.exports = {
  method: 'GET',
  path: '/non-ai',
  handler: (_request, h) => h.response(parsedPackingList).code(200)
}
