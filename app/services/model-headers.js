/**
 * Excel model headers registry
 *
 * Central registry combining all retailer-specific header configurations for Excel parsers.
 * Each retailer provides establishment number patterns and field mapping regex.
 */
const { asdaHeaders } = require("./model-headers/asda");
const bandmHeaders = require("./model-headers/bandm");
const { bookerHeaders } = require("./model-headers/booker");
const bootsHeaders = require("./model-headers/boots");
const buffaloadHeaders = require("./model-headers/buffaload");
const cdsHeaders = require("./model-headers/cds");
const coopHeaders = require("./model-headers/coop");
const davenportHeaders = require("./model-headers/davenport");
const fowlerWelchHeaders = require("./model-headers/fowlerwelch");
const { giovanniHeaders } = require("./model-headers/giovanni");
const kepakHeaders = require("./model-headers/kepak");
const marsHeaders = require("./model-headers/mars");
const nisaHeaders = require("./model-headers/nisa");
const nutriciaHeaders = require("./model-headers/nutricia");
const sainsburysHeaders = require("./model-headers/sainsburys");
const saversHeaders = require("./model-headers/savers");
const tescoHeaders = require("./model-headers/tesco");
const tjmorrisHeaders = require("./model-headers/tjmorris");
const turnersHeaders = require("./model-headers/turners");
const warrensHeaders = require("./model-headers/warrens");

const headers = {
  ...asdaHeaders,
  ...bandmHeaders,
  ...bookerHeaders,
  ...bootsHeaders,
  ...buffaloadHeaders,
  ...cdsHeaders,
  ...coopHeaders,
  ...davenportHeaders,
  ...fowlerWelchHeaders,
  ...giovanniHeaders,
  ...kepakHeaders,
  ...marsHeaders,
  ...nisaHeaders,
  ...nutriciaHeaders,
  ...sainsburysHeaders,
  ...saversHeaders,
  ...tescoHeaders,
  ...tjmorrisHeaders,
  ...turnersHeaders,
  ...warrensHeaders,
};

module.exports = headers;
