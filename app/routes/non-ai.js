const config = require('../config')
const excelToJson = require('convert-excel-to-json')
const parserService = require('../services/parser-service')
const { createPackingList } = require('../packing-list/index')
const { sendParsed } = require('../../app/messaging/send-parsed-message')

module.exports = {
  method: 'GET',
  path: '/non-ai',
  handler: async (_request, h) => {
    console.log(_request.query.filename)
    const filename = config.plDir + _request.query.filename
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
    } else {
      console.log('failed to parse')
    }
    if (isParsed) {
      const randomInt = Math.floor(Math.random() * (10000000 - 1 + 1) + 1).toString()
      await createPackingList(parsedPackingList, randomInt)
      try {
        await sendParsed(parsedPackingList.business_checks)
      } catch (err) {
        console.log(err)
      }
    }
    return h.response(parsedPackingList).code(200)
  }
}
