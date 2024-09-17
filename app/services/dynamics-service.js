const config = require('../config')
const dsConfig = config.dynamicsConfig
const approvalStatus = {
  Approved: 179640000,
  Rejected: 179640001
}

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
  } catch (err) {
    console.error(err)
    return err.message
  }
}

async function patchPackingListCheck (applicationId, isParsed) {
  const token = 'Bearer ' + await bearerTokenRequest()
  const url = `${dsConfig.dynamicsUrl}/api/data/v9.1/trd_exportapplications(trd_applicationreference='${applicationId}')`
  const outcome = isParsed ? approvalStatus.Approved : approvalStatus.Rejected
  try {
    const response = fetch(encodeURI(url), {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rms_automatedpackinglistcheck: outcome })
    })
    const status = (await response).status
    console.info(`Upsert ${applicationId} with outcome ${isParsed}, status ${status}`)

    return status
  } catch (err) {
    console.error(err)
    return err.message
  }
}

module.exports = { patchPackingListCheck, bearerTokenRequest }
