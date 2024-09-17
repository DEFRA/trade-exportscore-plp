const ParserModel = require("./parser-model");
const MatcherResult = require("./matcher-result");
const AsdaMatcher = require("./matchers/asda/model1");
const AsdaParser = require("./parsers/asda/model1");
const AsdaMatcher2 = require("./matchers/asda/model2");
const AsdaParser2 = require("./parsers/asda/model2");
const BandMMatcher = require("./matchers/bandm/model1");
const BandMParser = require("./parsers/bandm/model1");
const BuffaloadMatcher = require("./matchers/buffaload-logistics/model1");
const BuffaloadParser = require("./parsers/buffaload-logistics/model1");
const CoopMatcher = require("./matchers/co-op/model1");
const CoopParser = require("./parsers/co-op/model1");
const CdsMatcher = require("./matchers/cds/model1");
const CdsParser = require("./parsers/cds/model1");
const DavenportMatcher = require("./matchers/davenport/model1");
const DavenportParser = require("./parsers/davenport/model1");
const FowlerWelchMatcher = require("./matchers/fowlerwelch/model1");
const FowlerWelchParser = require("./parsers/fowlerwelch/model1");
const KepakMatcher = require("./matchers/kepak/model1");
const KepakParser = require("./parsers/kepak/model1");
const NisaMatcher = require("./matchers/nisa/model1");
const NisaParser = require("./parsers/nisa/model1");
const NisaMatcher2 = require("./matchers/nisa/model2");
const NisaParser2 = require("./parsers/nisa/model2");
const NisaMatcher3 = require("./matchers/nisa/model3");
const NisaParser3 = require("./parsers/nisa/model3");
const NutriciaMatcher = require("./matchers/nutricia/model1");
const NutriciaParser = require("./parsers/nutricia/model1");
const SainsburysMatcher = require("./matchers/sainsburys/model1");
const SainsburysParser = require("./parsers/sainsburys/model1");
const TescosMatcher = require("./matchers/tescos/model1");
const TescosParser = require("./parsers/tescos/model1");
const TescosMatcher2 = require("./matchers/tescos/model2");
const TescosParser2 = require("./parsers/tescos/model2");
const TescosMatcher3 = require("./matchers/tescos/model3");
const TescosParser3 = require("./parsers/tescos/model3");
const TjMorrisMatcher = require("./matchers/tjmorris/model1");
const TjMorrisParser = require("./parsers/tjmorris/model1");
const GiovanniMatcher = require("./matchers/giovanni/model1");
const GiovanniParser = require("./parsers/giovanni/model1");
const WarrensMatcher = require("./matchers/warrens/model1");
const WarrensParser = require("./parsers/warrens/model1");
const CombineParser = require("./parser-combine");

function processExcelPackingList(sanitisedPackingList, filename) {
  const INPUT_DATA_SHEET = "Input Data Sheet";
  let parsedPackingList = failedParser();

  if (TjMorrisMatcher.matches(sanitisedPackingList) === MatcherResult.CORRECT) {
    logMatch(ParserModel.TJMORRIS1, filename);
    parsedPackingList = TjMorrisParser.parse(sanitisedPackingList.Sheet1);
  } else if (
    AsdaMatcher.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.ASDA1, filename);
    parsedPackingList = AsdaParser.parse(
      sanitisedPackingList.PackingList_Extract,
    );
  } else if (
    AsdaMatcher2.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.ASDA2, filename);
    parsedPackingList = AsdaParser2.parse(sanitisedPackingList.Sheet1);
  } else if (
    SainsburysMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.SAINSBURYS1, filename);
    parsedPackingList = SainsburysParser.parse(sanitisedPackingList.Sheet1);
  } else if (
    BandMMatcher.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.BANDM1, filename);
    parsedPackingList = BandMParser.parse(sanitisedPackingList.Sheet1);
    isParsed = true;
  } else if (
    CoopMatcher.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.COOP1, filename);
    parsedPackingList = CoopParser.parse(
      sanitisedPackingList["Input Packing Sheet"],
    );
  } else if (
    TescosMatcher.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.TESCO1, filename);
    parsedPackingList = TescosParser.parse(
      sanitisedPackingList[INPUT_DATA_SHEET],
    );
  } else if (
    TescosMatcher2.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.TESCO2, filename);
    parsedPackingList = TescosParser2.parse(sanitisedPackingList.Sheet2);
  } else if (
    TescosMatcher3.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.TESCO3, filename);
    parsedPackingList = TescosParser3.parse(
      sanitisedPackingList[INPUT_DATA_SHEET],
    );
  } else if (
    FowlerWelchMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.FOWLERWELCH1, filename);
    parsedPackingList = FowlerWelchParser.parse(sanitisedPackingList);
  } else if (
    NisaMatcher.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.NISA1, filename);
    parsedPackingList = NisaParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    NisaMatcher2.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.NISA2, filename);
    parsedPackingList = NisaParser2.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    NisaMatcher3.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.NISA3, filename);
    parsedPackingList = NisaParser3.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    BuffaloadMatcher.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.BUFFALOAD1, filename);
    parsedPackingList = BuffaloadParser.parse(sanitisedPackingList.Tabelle1);
    isParsed = true;
  } else if (
    CdsMatcher.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.CDS1, filename);
    parsedPackingList = CdsParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    DavenportMatcher.matches(sanitisedPackingList) === MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.DAVENPORT1, filename);
    parsedPackingList = DavenportParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    GiovanniMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.GIOVANNI1, filename);
    parsedPackingList = GiovanniParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    KepakMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.KEPAK1, filename);
    parsedPackingList = KepakParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    NutriciaMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.NUTRICIA1, filename);
    parsedPackingList = NutriciaParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    WarrensMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    logMatch(ParserModel.WARRENS1, filename);
    parsedPackingList = WarrensParser.parse(sanitisedPackingList);
  } else {
    console.info("Failed to parse packing list with filename: ", filename);
  }
  return parsedPackingList;
}

function logMatch(model, filename) {
  console.info(`Packing list matches ${model} with filename: ${filename}`);
}

function failedParser() {
  return CombineParser.combine(null, [], false, ParserModel.NOMATCH);
}

module.exports = {
  failedParser,
  processExcelPackingList,
};
