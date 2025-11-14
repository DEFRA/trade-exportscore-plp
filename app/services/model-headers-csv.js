const { csvIcelandHeaders } = require("./model-headers/iceland");
const { csvAsdaHeaders } = require("./model-headers/asda");

// CSV-specific model headers
const headers = {
  ...csvIcelandHeaders,
  ...csvAsdaHeaders,
};

module.exports = headers;
