const { plDir } = require('../config')
const excelToJson = require('convert-excel-to-json')
const parserService = require('../services/parser-service')
const { createPackingList } = require('../packing-list/index')
const { parse } = require('uuid')

const filename = plDir + 'Packing List 618.xlsx'
let result = {}
try {
  result = excelToJson({
    sourceFile: filename
  })
} catch (err) {
  console.log(err)
}
let parsedPackingList = parserService.failedParser()
let isParsed = false
if (parserService.matchesAsda(result, filename)) {
  console.log('Packing list matches Asda')
  parsedPackingList = parserService.parseAsda(result.PackingList_Extract)
  isParsed = true
} else if (parserService.matchesBandM(result, filename)) {
  console.log('Packing list matches BandM')
  parsedPackingList = parserService.parseBandM(result.Sheet1)
  isParsed = true
} else if (parserService.matchesTescoModel1(result, filename)) {
  console.log('Packing list matches Tesco Model 1')
  parsedPackingList = parserService.parseTescoModel1(result.Input_Data_Sheet)
  isParsed = true
} else if (parserService.matchesTescoModel2(result, filename)) {
  console.log('Packing list matches Tesco Model 2')
  parsedPackingList = parserService.parseTescoModel2(result.Sheet2)
  isParsed = true
} else {
  console.log('failed to parse')
}

let hasSaved = false

module.exports = {
  method: 'GET',
  path: '/non-ai',
  handler: async (_request, h) => {
    if (isParsed && !hasSaved) {
      const randomInt = Math.floor(Math.random() * (10000000 - 1 + 1) + 1).toString()
      // await createPackingList(parsedPackingList, randomInt)
      hasSaved = true
    }
    return h.response(parsedPackingList).code(200)
  }
}
