/**
 * CSV model headers registry
 *
 * Aggregates CSV-specific header configurations from individual retailer modules.
 * Used by CSV parsers to identify and extract field data.
 */
const { csvIcelandHeaders } = require("./model-headers/iceland");
const { csvAsdaHeaders } = require("./model-headers/asda");

const headers = {
  ...csvIcelandHeaders,
  ...csvAsdaHeaders,
};

module.exports = headers;
