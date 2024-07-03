const { patchPackingListCheck } = require('../../app/services/dynamics-service')

module.exports = {
  method: 'GET',
  path: '/upsert-idcoms',
  options: {
    handler: async (request, h) => {
      try {
        const checkStatus = await patchPackingListCheck(request.query.applicationId, request.query.isParsed)
        return h.response(checkStatus).code(200)
      } catch (err) {
        console.error('Error running upsert: ', err)
      }
    }
  }
}
