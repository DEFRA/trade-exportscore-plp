/**
 * Parser and matcher registry
 *
 * Central registry mapping all retailer matchers and parsers for Excel, CSV, PDF AI,
 * and PDF non-AI formats. Exports grouped collections for parser factory selection.
 */
const noMatchMatcher = require("./matchers/no-match/model1");
const noMatchParser = require("./parsers/no-match/model1");
const asdaMatcher3 = require("./matchers/asda/model3");
const asdaParser3 = require("./parsers/asda/model3");
const asdaMatcher4 = require("./matchers/asda/model4");
const asdaParser4 = require("./parsers/asda/model4");
const bandMMatcher = require("./matchers/bandm/model1");
const bandMParser = require("./parsers/bandm/model1");
const bootsMatcher = require("./matchers/boots/model1");
const bootsParser = require("./parsers/boots/model1");
const buffaloadMatcher = require("./matchers/buffaload-logistics/model1");
const buffaloadParser = require("./parsers/buffaload-logistics/model1");
const cds1Matcher = require("./matchers/cds/model1");
const cds1Parser = require("./parsers/cds/model1");
const cds2Matcher = require("./matchers/cds/model2");
const cds2Parser = require("./parsers/cds/model2");
const coopMatcher = require("./matchers/co-op/model1");
const coopParser = require("./parsers/co-op/model1");
const davenportMatcher2 = require("./matchers/davenport/model2");
const davenportParser2 = require("./parsers/davenport/model2");
const fowlerWelchMatcher = require("./matchers/fowlerwelch/model1");
const fowlerWelchParser = require("./parsers/fowlerwelch/model1");
const fowlerWelchMatcher2 = require("./matchers/fowlerwelch/model2");
const fowlerWelchParser2 = require("./parsers/fowlerwelch/model2");
const giovanniMatcher = require("./matchers/giovanni/model1");
const giovanniParser = require("./parsers/giovanni/model1");
const giovanniMatcher2 = require("./matchers/giovanni/model2");
const giovanniParser2 = require("./parsers/giovanni/model2");
const kepakMatcher = require("./matchers/kepak/model1");
const kepakParser = require("./parsers/kepak/model1");
const nisaMatcher = require("./matchers/nisa/model1");
const nisaParser = require("./parsers/nisa/model1");
const marsMatcher = require("./matchers/mars/model1");
const marsParser = require("./parsers/mars/model1");
const nisaMatcher2 = require("./matchers/nisa/model2");
const nisaParser2 = require("./parsers/nisa/model2");
const nutriciaMatcher = require("./matchers/nutricia/model1");
const nutriciaParser = require("./parsers/nutricia/model1");
const nutriciaMatcher2 = require("./matchers/nutricia/model2");
const nutriciaParser2 = require("./parsers/nutricia/model2");
const sainsburysMatcher = require("./matchers/sainsburys/model1");
const sainsburysParser = require("./parsers/sainsburys/model1");
const saversMatcher = require("./matchers/savers/model1");
const saversParser = require("./parsers/savers/model1");
const tescosMatcher2 = require("./matchers/tescos/model2");
const tescosParser2 = require("./parsers/tescos/model2");
const tescosMatcher3 = require("./matchers/tescos/model3");
const tescosParser3 = require("./parsers/tescos/model3");
const tjMorrisMatcher = require("./matchers/tjmorris/model1");
const tjMorrisParser = require("./parsers/tjmorris/model1");
const tjMorrisMatcher2 = require("./matchers/tjmorris/model2");
const tjMorrisParser2 = require("./parsers/tjmorris/model2");
const warrensMatcher2 = require("./matchers/warrens/model2");
const warrensParser2 = require("./parsers/warrens/model2");
const icelandMatcher = require("./matchers/iceland/model1");
const icelandParser = require("./parsers/iceland/model1");
const icelandMatcher2 = require("./matchers/iceland/model2");
const icelandParser2 = require("./parsers/iceland/model2");
const mandsMatcher = require("./matchers/mands/model1");
const mandsParser = require("./parsers/mands/model1");
const bookerMatcher = require("./matchers/booker/model1");
const bookerParser = require("./parsers/booker/model1");
const bookerMatcher2 = require("./matchers/booker/model2");
const bookerParser2 = require("./parsers/booker/model2");
const greggsMatcher = require("./matchers/greggs/model1");
const greggsParser = require("./parsers/greggs/model1");
const giovanniMatcher3 = require("./matchers/giovanni/model3");
const giovanniParser3 = require("./parsers/giovanni/model3");
const goustoMatcher = require("./matchers/gousto/model1");
const goustoParser = require("./parsers/gousto/model1");
const turnersMatcher = require("./matchers/turners/model1");
const turnersParser = require("./parsers/turners/model1");

const parsersExcel = {
  ASDA3: {
    matches: (packingList, filename) =>
      asdaMatcher3.matches(packingList, filename),
    parse: (packingList, filename) => asdaParser3.parse(packingList, filename),
  },
  BANDM1: {
    matches: (packingList, filename) =>
      bandMMatcher.matches(packingList, filename),
    parse: (packingList, filename) => bandMParser.parse(packingList, filename),
  },
  BOOKER2: {
    matches: (packingList, filename) =>
      bookerMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      bookerParser2.parse(packingList, filename),
  },
  BOOTS1: {
    matches: (packingList, filename) =>
      bootsMatcher.matches(packingList, filename),
    parse: (packingList, filename) => bootsParser.parse(packingList, filename),
  },
  BUFFALOAD1: {
    matches: (packingList, filename) =>
      buffaloadMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      buffaloadParser.parse(packingList, filename),
  },
  CDS2: {
    matches: (packingList, filename) =>
      cds2Matcher.matches(packingList, filename),
    parse: (packingList, filename) => cds2Parser.parse(packingList, filename),
  },
  CDS1: {
    matches: (packingList, filename) =>
      cds1Matcher.matches(packingList, filename),
    parse: (packingList, filename) => cds1Parser.parse(packingList, filename),
  },
  COOP1: {
    matches: (packingList, filename) =>
      coopMatcher.matches(packingList, filename),
    parse: (packingList, filename) => coopParser.parse(packingList, filename),
  },
  DAVENPORT2: {
    matches: (packingList, filename) =>
      davenportMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      davenportParser2.parse(packingList, filename),
  },
  FOWLERWELCH1: {
    matches: (packingList, filename) =>
      fowlerWelchMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      fowlerWelchParser.parse(packingList, filename),
  },
  FOWLERWELCH2: {
    matches: (packingList, filename) =>
      fowlerWelchMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      fowlerWelchParser2.parse(packingList, filename),
  },
  GIOVANNI1: {
    matches: (packingList, filename) =>
      giovanniMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      giovanniParser.parse(packingList, filename),
  },
  GIOVANNI2: {
    matches: (packingList, filename) =>
      giovanniMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      giovanniParser2.parse(packingList, filename),
  },
  GOUSTO1: {
    matches: (packingList, filename) =>
      goustoMatcher.matches(packingList, filename),
    parse: (packingList, filename) => goustoParser.parse(packingList, filename),
  },
  KEPAK1: {
    matches: (packingList, filename) =>
      kepakMatcher.matches(packingList, filename),
    parse: (packingList, filename) => kepakParser.parse(packingList, filename),
  },
  MARS1: {
    matches: (packingList, filename) =>
      marsMatcher.matches(packingList, filename),
    parse: (packingList, filename) => marsParser.parse(packingList, filename),
  },
  NISA1: {
    matches: (packingList, filename) =>
      nisaMatcher.matches(packingList, filename),
    parse: (packingList, filename) => nisaParser.parse(packingList, filename),
  },
  NISA2: {
    matches: (packingList, filename) =>
      nisaMatcher2.matches(packingList, filename),
    parse: (packingList, filename) => nisaParser2.parse(packingList, filename),
  },
  NUTRICIA1: {
    matches: (packingList, filename) =>
      nutriciaMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      nutriciaParser.parse(packingList, filename),
  },
  NUTRICIA2: {
    matches: (packingList, filename) =>
      nutriciaMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      nutriciaParser2.parse(packingList, filename),
  },
  SAINSBURYS1: {
    matches: (packingList, filename) =>
      sainsburysMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      sainsburysParser.parse(packingList, filename),
  },
  SAVERS1: {
    matches: (packingList, filename) =>
      saversMatcher.matches(packingList, filename),
    parse: (packingList, filename) => saversParser.parse(packingList, filename),
  },
  TESCO2: {
    matches: (packingList, filename) =>
      tescosMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      tescosParser2.parse(packingList, filename),
  },
  TESCO3: {
    matches: (packingList, filename) =>
      tescosMatcher3.matches(packingList, filename),
    parse: (packingList, filename) =>
      tescosParser3.parse(packingList, filename),
  },
  TJMORRIS1: {
    matches: (packingList, filename) =>
      tjMorrisMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      tjMorrisParser.parse(packingList, filename),
  },
  TJMORRIS2: {
    matches: (packingList, filename) =>
      tjMorrisMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      tjMorrisParser2.parse(packingList, filename),
  },
  WARRENS2: {
    matches: (packingList, filename) =>
      warrensMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      warrensParser2.parse(packingList, filename),
  },
  TURNERS1: {
    matches: (packingList, filename) =>
      turnersMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      turnersParser.parse(packingList, filename),
  },
};

const parsersPdf = {
  ICELAND1: {
    matches: (packingList, filename) =>
      icelandMatcher.matches(packingList, filename),
    parse: (packingList, filename) =>
      icelandParser.parse(packingList, filename),
  },
  MANDS1: {
    matches: (packingList, filename) =>
      mandsMatcher.matches(packingList, filename),
    parse: (packingList, filename) => mandsParser.parse(packingList, filename),
  },
  GREGGS1: {
    matches: (packingList, filename) =>
      greggsMatcher.matches(packingList, filename),
    parse: (packingList, filename) => greggsParser.parse(packingList, filename),
  },
};

const missingRemosParserMessage = "missing remos parser";

const noMatchParsers = {
  UNRECOGNISED: {
    parse: (_packingList, _filename) =>
      noMatchParser.unrecognisedParse(_packingList, _filename),
    name: "unrecognised parser",
  },
  NOREMOS: {
    matches: (packingList, _filename) =>
      noMatchMatcher.noRemosMatch(packingList, _filename),
    parse: (_packingList, _filename) =>
      noMatchParser.noRemosParse(_packingList, _filename),
    name: missingRemosParserMessage,
  },
  NOREMOSCSV: {
    matches: (packingList) => noMatchMatcher.noRemosMatchCsv(packingList),
    parse: () => noMatchParser.noRemosParse(),
    name: missingRemosParserMessage,
  },
  NOREMOSPDF: {
    matches: (packingList) => noMatchMatcher.noRemosMatchPdf(packingList),
    parse: () => noMatchParser.noRemosParse(),
    name: missingRemosParserMessage,
  },
};

const parsersPdfNonAi = {
  BOOKER1: {
    matches: (packingList, filename) =>
      bookerMatcher.matches(packingList, filename),
    parse: (packingList, filename) => bookerParser.parse(packingList, filename),
  },
  GIOVANNI3: {
    matches: (packingList, filename) =>
      giovanniMatcher3.matches(packingList, filename),
    parse: (packingList, filename) =>
      giovanniParser3.parse(packingList, filename),
  },
};

const parsersCsv = {
  ASDA4: {
    matches: (packingList, filename) =>
      asdaMatcher4.matches(packingList, filename),
    parse: (packingList, filename) => asdaParser4.parse(packingList, filename),
  },
  ICELAND2: {
    matches: (packingList, filename) =>
      icelandMatcher2.matches(packingList, filename),
    parse: (packingList, filename) =>
      icelandParser2.parse(packingList, filename),
  },
};

module.exports = {
  parsersExcel,
  parsersCsv,
  parsersPdf,
  noMatchParsers,
  parsersPdfNonAi,
};
