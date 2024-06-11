const { plDir } = require('../config')
const excelToJson = require('convert-excel-to-json')
const parserService = require('../services/parser-service')
const { createPackingList } = require('../packing-list/index')

const filename = plDir + 'test-packing-list.xlsx'
let result = {}
try {
  result = excelToJson({
    sourceFile: filename
  })
} catch (err) {
  console.log(err)
}

// match and parse
let parsedPackingList = parserService.failedParser
let isParsed = false
if (parserService.matchesAsda()) {
  console.log('Packling list matches Asda')
  isParsed = true
} else if (parserService.matchesBandM(result.Sheet1, filename)) {
  console.log('Packling list matches BandM')
  parsedPackingList = parserService.parseBandM(result.Sheet1)
  isParsed = true
} else {
  console.log('failed to parse')
}

// save to db
if (isParsed) {
  const randomInt = Math.floor(Math.random() * (10000000 - 1 + 1) + 1).toString()
  createPackingList(parsedPackingList, randomInt)
}

module.exports = {
  method: 'GET',
  path: '/non-ai',
  handler: (_request, h) => h.response(parsedPackingList).code(200)
}
