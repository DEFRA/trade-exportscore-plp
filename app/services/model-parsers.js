const asdaMatcher = require("./matchers/asda/model1");
const asdaParser = require("./parsers/asda/model1");
const asdaMatcher2 = require("./matchers/asda/model2");
const asdaParser2 = require("./parsers/asda/model2");
const bandMMatcher = require("./matchers/bandm/model1");
const bandMParser = require("./parsers/bandm/model1");
const buffaloadMatcher = require("./matchers/buffaload-logistics/model1");
const buffaloadParser = require("./parsers/buffaload-logistics/model1");
const cdsMatcher = require("./matchers/cds/model1");
const cdsParser = require("./parsers/cds/model1");
const coopMatcher = require("./matchers/co-op/model1");
const coopParser = require("./parsers/co-op/model1");
const davenportMatcher = require("./matchers/davenport/model1");
const davenportParser = require("./parsers/davenport/model1");
const fowlerWelchMatcher = require("./matchers/fowlerwelch/model1");
const fowlerWelchParser = require("./parsers/fowlerwelch/model1");
const giovanniMatcher = require("./matchers/giovanni/model1");
const giovanniParser = require("./parsers/giovanni/model1");
const kepakMatcher = require("./matchers/kepak/model1");
const kepakParser = require("./parsers/kepak/model1");
const nisaMatcher = require("./matchers/nisa/model1");
const nisaParser = require("./parsers/nisa/model1");
const nisaMatcher2 = require("./matchers/nisa/model2");
const nisaParser2 = require("./parsers/nisa/model2");
const nutriciaMatcher = require("./matchers/nutricia/model1");
const nutriciaParser = require("./parsers/nutricia/model1");
const sainsburysMatcher = require("./matchers/sainsburys/model1");
const sainsburysParser = require("./parsers/sainsburys/model1");
const tescosMatcher = require("./matchers/tescos/model1");
const tescosParser = require("./parsers/tescos/model1");
const tescosMatcher2 = require("./matchers/tescos/model2");
const tescosParser2 = require("./parsers/tescos/model2");
const tjMorrisMatcher = require("./matchers/tjmorris/model1");
const tjMorrisParser = require("./parsers/tjmorris/model1");
const warrensMatcher = require("./matchers/warrens/model1");
const warrensParser = require("./parsers/warrens/model1");

const parsersExcel = {
  ASDA1: {
    matches: (packingList, filename) =>
      asdaMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      asdaParser.parse(packingList.PackingList_Extract, filename),
  },
  ASDA2: {
    matches: (packingList, filename) =>
      asdaMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      asdaParser2.parse(packingList.Sheet1, filename),
  },
  BANDM1: {
    matches: (packingList, filename) =>
      bandMMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      bandMParser.parse(packingList.Sheet1, filename),
  },
  BUFFALOAD1: {
    matches: (packingList, filename) =>
      buffaloadMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      buffaloadParser.parse(packingList.Tabelle1, filename),
  },
  CDS1: {
    matches: (packingList, filename) =>
      cdsMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      cdsParser.parse(packingList[Object.keys(packingList)[0]], filename),
  },
  COOP1: {
    matches: (packingList, filename) =>
      coopMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      coopParser.parse(packingList["Input Packing Sheet"], filename),
  },
  DAVENPORT1: {
    matches: (packingList, filename) =>
      davenportMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      davenportParser.parse(packingList[Object.keys(packingList)[0]], filename),
  },
  FOWLERWELCH1: {
    matches: (packingList, filename) =>
      fowlerWelchMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      fowlerWelchParser.parse(packingList, filename),
  },
  GIOVANNI1: {
    matches: (packingList, filename) =>
      giovanniMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      giovanniParser.parse(packingList[Object.keys(packingList)[0]], filename),
  },
  KEPAK1: {
    matches: (packingList, filename) =>
      kepakMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      kepakParser.parse(packingList[Object.keys(packingList)[0]], filename),
  },
  NISA1: {
    matches: (packingList, filename) =>
      nisaMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      nisaParser.parse(packingList[Object.keys(packingList)[0]], filename),
  },
  NISA2: {
    matches: (packingList, filename) =>
      nisaMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      nisaParser2.parse(packingList[Object.keys(packingList)[0]], filename),
  },
  NUTRICIA1: {
    matches: (packingList, filename) =>
      nutriciaMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      nutriciaParser.parse(packingList[Object.keys(packingList)[0]], filename),
  },
  SAINSBURYS1: {
    matches: (packingList, filename) =>
      sainsburysMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      sainsburysParser.parse(packingList.Sheet1, filename),
  },
  TESCO1: {
    matches: (packingList, filename) =>
      tescosMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      tescosParser.parse(packingList["Input Data Sheet"], filename),
  },
  TESCO2: {
    matches: (packingList, filename) =>
      tescosMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      tescosParser2.parse(packingList.Sheet2, filename),
  },
  TJMORRIS1: {
    matches: (packingList, filename) =>
      tjMorrisMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      tjMorrisParser.parse(packingList.Sheet1, filename),
  },
  WARRENS1: {
    matches: (packingList, filename) =>
      warrensMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      warrensParser.parse(packingList, filename),
  },
};

module.exports = { parsersExcel };