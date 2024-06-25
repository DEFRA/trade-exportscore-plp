const config = require('../config')
const excelToJson = require('convert-excel-to-json')
const parserService = require('../services/parser-service')
const { createPackingList } = require('../packing-list/index')
const { sendParsed } = require('../../app/messaging/send-parsed-message')

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
    if (parserService.matchesAsda(result, filename)) {
      console.info('Packing list matches Asda with filename: ', filename)
      parsedPackingList = parserService.parseAsda(result.PackingList_Extract)
      isParsed = true
    } else if (parserService.matchesBandM(result, filename)) {
      console.info('Packing list matches BandM with filename: ', filename)
      parsedPackingList = parserService.parseBandM(result.Sheet1)
      isParsed = true
    } else if (parserService.matchesSainsburys(result, filename)) {
      console.info('Packing list matches Sainsburys with filename: ', filename)
      parsedPackingList = parserService.parseSainsburys(result.Sheet1)
      isParsed = true
    } else {
      console.info('Failed to parse packing list with filename: ', filename)
    }

    if (isParsed) {
      const randomInt = Math.floor(Math.random() * (10000000 - 1 + 1) + 1).toString()
      await createPackingList(parsedPackingList, randomInt)
      try {
        await sendParsed(parsedPackingList.business_checks)
      } catch (err) {
        console.error(err)
      }
    }
    return h.response(parsedPackingList).code(200)
  }
}
