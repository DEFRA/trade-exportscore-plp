import isVisible from '../support/check/isDisplayed'

const { Then } = require('cucumber')

Then(
  /^I expect that element "([^"]*)?" is( not)* displayed$/,
  isVisible
)
