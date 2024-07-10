const config = require('../config')
const excelToJson = require('convert-excel-to-json')
const parserService = require('../services/parser-service')
const { createPackingList } = require('../packing-list/index')
const { patchPackingListCheck } = require('../services/dynamics-service')
const MatcherResult = require('../services/matches-result')

module.exports = {
  method: 'GET',
  path: '/non-ai',
  handler: async (_request, h) => {
    const filename = config.plDir + _request.query.filename
    let result = {}
    try {
      result = excelToJson({
        sourceFile: filename
      })
    } catch (err) {
      console.error(err)
    }

    let parsedPackingList = parserService.failedParser()
    let isParsed = false

    if (parserService.matchesTjmorris(result, filename) === MatcherResult.CORRECT) {
      console.info('Packing list matches TJ Morris with filename: ', filename)
      parsedPackingList = parserService.parseTjmorris(result.Sheet1)
      isParsed = true
    } else if (parserService.matchesAsda(result, filename) === MatcherResult.CORRECT) {
      console.info('Packing list matches Asda with filename: ', filename)
      parsedPackingList = parserService.parseAsda(result.PackingList_Extract)
      isParsed = true
    } else if (parserService.matchesSainsburys(result, filename) === MatcherResult.CORRECT) {
      console.info('Packing list matches Sainsburys with filename: ', filename)
      parsedPackingList = parserService.parseSainsburys(result.Sheet1)
      isParsed = true
    } else if (parserService.matchesBandM(result, filename) === MatcherResult.CORRECT) {
      console.info('Packing list matches BandM with filename: ', filename)
      parsedPackingList = parserService.parseBandM(result.Sheet1)
      isParsed = true
    } else if (parserService.matchesTescoModel1(result, filename) === MatcherResult.CORRECT) {
      console.log('Packing list matches Tesco Model 1 with filename: ', filename)
      parsedPackingList = parserService.parseTescoModel1(result.Input_Data_Sheet)
      isParsed = true
    } else if (parserService.matchesTescoModel2(result, filename) === MatcherResult.CORRECT) {
      console.log('Packing list matches Tesco Model 2 with filename: ', filename)
      parsedPackingList = parserService.parseTescoModel2(result.Sheet2)
      isParsed = true
    } else {
      console.info('Failed to parse packing list with filename: ', filename)
    }

    if (isParsed) {
      const randomInt = Math.floor(Math.random() * (10000000 - 1 + 1) + 1).toString() // TODO replace with application id from ehco
      await createPackingList(parsedPackingList, randomInt)
      try {
        const checkStatus = await patchPackingListCheck(process.env.DYNAMICS_APPLICATION_ID, true) // TODO replace with application id from ehco
        console.log('Packing list check upsert to IDCOMS with status ', checkStatus)
      } catch (err) {
        console.error(err)
      }
    }
    return h.response(parsedPackingList).code(200)
  }
}
