module.exports = {
  method: 'GET',
  path: '/healthz',
  options: {
    handler: (request, h) => {
      return h.response('ok').code(200)
    }
  }
}
