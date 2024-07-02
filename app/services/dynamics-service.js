const config = require('../config')
const dsConfig = config.dynamicsConfig

async function bearerTokenRequest () {
  try {
    const response = await fetch(dsConfig.bearerTokenRequest.url, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: dsConfig.bearerTokenRequest.grantType,
        client_id: dsConfig.bearerTokenRequest.clientId,
        client_secret: dsConfig.bearerTokenRequest.clientSecret,
        resource: dsConfig.bearerTokenRequest.resource
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()
    return json.access_token
  } catch (error) {
    console.error(error.message)
  }
}

async function patchPackingListCheck (applicationId, isParsed) {
  const token = 'Bearer ' + await bearerTokenRequest()
  const url = dsConfig.dynamicsUrl + '/api/data/v9.1/trd_exportapplications(trd_applicationreference=\'' + applicationId + '\')'
  const outcome = isParsed ? 179640000 : 179640001
  try {
    const response = fetch(encodeURI(url), {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rms_automatedpackinglistcheck: outcome })
    })

    return ((await response).status)
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = { patchPackingListCheck, bearerTokenRequest }
