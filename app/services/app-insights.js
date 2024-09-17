const appInsights = require('applicationinsights')

function setup () {
  try {
    if (process.env.APPINSIGHTS_CONNECTIONSTRING) {
      appInsights.setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
        .setAutoCollectConsole(true, true)
        .start()
      console.info('App Insights Running')
      const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
      const appName = process.env.APPINSIGHTS_CLOUDROLE
      appInsights.defaultClient.context.tags[cloudRoleTag] = appName
    } else {
      console.info('App Insights Not Running!')
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = { setup }
