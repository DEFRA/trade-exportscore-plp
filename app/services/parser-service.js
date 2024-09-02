const MatcherResult = require("./matches-result");
const ParserModel = require("./parser-model");
const AsdaMatcher = require("../services/matchers/asda/model1/matcher");
const AsdaParser = require("../services/parsers/asda/model1/parser");
const AsdaMatcher2 = require("../services/matchers/asda/model2/matcher");
const AsdaParser2 = require("../services/parsers/asda/model2/parser");
const BandMMatcher = require("../services/matchers/bandm/model1/matcher");
const BandMParser = require("../services/parsers/bandm/model1/parser");
const BuffaloadMatcher = require("./matchers/buffaload-logistics/model1/matcher");
const BuffaloadParser = require("./parsers/buffaload-logistics/model1/parser");
const CoopMatcher = require("./matchers/co-op/model1/matcher");
const CoopParser = require("./parsers/co-op/model1/parser");
const CdsMatcher = require("./matchers/cds/model1/matcher");
const CdsParser = require("./parsers/cds/model1/parser");
const DavenportMatcher = require("./matchers/davenport/model1/matcher");
const DavenportParser = require("../services/parsers/davenport/model1/parser");
const FowlerWelchMatcher = require("../services/matchers/fowlerwelch/model1/matcher");
const FowlerWelchParser = require("../services/parsers/fowlerwelch/model1/parser");
const KepakMatcher = require("../services/matchers/kepak/model1/matcher");
const KepakParser = require("../services/parsers/kepak/model1/parser");
const NisaMatcher = require("../services/matchers/nisa/model1/matcher");
const NisaParser = require("../services/parsers/nisa/model1/parser");
const NisaMatcher2 = require("../services/matchers/nisa/model2/matcher");
const NisaParser2 = require("../services/parsers/nisa/model2/parser");
const NisaMatcher3 = require("../services/matchers/nisa/model3/matcher");
const NisaParser3 = require("../services/parsers/nisa/model3/parser");
const NutriciaMatcher = require("../services/matchers/nutricia/model1/matcher");
const NutriciaParser = require("../services/parsers/nutricia/model1/parser");
const SainsburysMatcher = require("../services/matchers/sainsburys/model1/matcher");
const SainsburysParser = require("../services/parsers/sainsburys/model1/parser");
const TescosMatcher = require("../services/matchers/tescos/model1/matcher");
const TescosParser = require("../services/parsers/tescos/model1/parser");
const TescosMatcher2 = require("../services/matchers/tescos/model2/matcher");
const TescosParser2 = require("../services/parsers/tescos/model2/parser");
const TescosMatcher3 = require("../services/matchers/tescos/model3/matcher");
const TescosParser3 = require("../services/parsers/tescos/model3/parser");
const TjMorrisMatcher = require("../services/matchers/tjmorris/model1/matcher");
const TjMorrisParser = require("../services/parsers/tjmorris/model1/parser");
const GiovanniMatcher = require("./matchers/giovanni/model1/matcher");
const GiovanniParser = require("./parsers/giovanni/model1/parser");
const CombineParser = require("./parser-combine");
const JsonFile = require("../utilities/json-file");

const INPUT_DATA_SHEET = "Input Data Sheet";

const isNullOrUndefined = (value) => value === null || value === undefined;
function findParser(packingList, filename) {
  let parsedPackingList = failedParser();

  // Sanitised packing list (i.e. emove trailing spaces and empty cells)
  const packingListJson = JSON.stringify(packingList);
  const sanitisedPackingListJson = JsonFile.sanitises(packingListJson);
  const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

  if (
    TjMorrisMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = TjMorrisParser.parse(sanitisedPackingList.Sheet1);
  } else if (
    AsdaMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = AsdaParser.parse(
      sanitisedPackingList.PackingList_Extract,
    );
  } else if (
    AsdaMatcher2.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = AsdaParser2.parse(sanitisedPackingList.Sheet1);
  } else if (
    SainsburysMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = SainsburysParser.parse(sanitisedPackingList.Sheet1);
  } else if (
    BandMMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = BandMParser.parse(sanitisedPackingList.Sheet1);
    isParsed = true;
  } else if (
    CoopMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = CoopParser.parse(
      sanitisedPackingList["Input Packing Sheet"],
    );
  } else if (
    TescosMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = TescosParser.parse(
      sanitisedPackingList[INPUT_DATA_SHEET],
    );
  } else if (
    TescosMatcher2.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = TescosParser2.parse(sanitisedPackingList.Sheet2);
  } else if (
    TescosMatcher3.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = TescosParser3.parse(
      sanitisedPackingList[INPUT_DATA_SHEET],
    );
  } else if (
    FowlerWelchMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = FowlerWelchParser.parse(sanitisedPackingList);
  } else if (
    NisaMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = NisaParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    NisaMatcher2.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = NisaParser2.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    NisaMatcher3.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = NisaParser3.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    BuffaloadMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = BuffaloadParser.parse(sanitisedPackingList.Tabelle1);
    isParsed = true;
  } else if (
    CdsMatcher.matches(sanitisedPackingList, filename) === MatcherResult.CORRECT
  ) {
    parsedPackingList = CdsParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    DavenportMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    console.info(
      "Packing list matches Davenport Model 1 with filename: ",
      filename,
    );
    parsedPackingList = DavenportParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    GiovanniMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = GiovanniParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    KepakMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = KepakParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else if (
    NutriciaMatcher.matches(sanitisedPackingList, filename) ===
    MatcherResult.CORRECT
  ) {
    parsedPackingList = NutriciaParser.parse(
      sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
    );
  } else {
    console.info("Failed to parse packing list with filename: ", filename);
  }
  if (parsedPackingList.parserModel !== ParserModel.NOMATCH) {
    parsedPackingList.items = parsedPackingList.items.filter(
      (x) => !Object.values(x).every(isNullOrUndefined),
    );
    parsedPackingList.items = checkType(parsedPackingList.items);
    parsedPackingList.business_checks.all_required_fields_present =
      checkRequiredData(parsedPackingList);
  }

  return parsedPackingList;
}

function failedParser() {
  return CombineParser.combine(null, [], false, ParserModel.NOMATCH);
}

function checkRequiredData(packingList) {
  const hasCommodityCode = packingList.items.every(
    (x) => x.commodity_code !== null,
  );
  const hasTreatmentOrNature = packingList.items.every(
    (x) => x.nature_of_products !== null && x.type_of_treatment !== null,
  );
  const hasDescription = packingList.items.every((x) => x.description !== null);
  const hasPackages = packingList.items.every(
    (x) => x.number_of_packages !== null,
  );
  const hasNetWeight = packingList.items.every(
    (x) => x.total_net_weight_kg !== null,
  );
  const hasRemos = packingList.registration_approval_number !== null;
  return (
    (hasCommodityCode || hasTreatmentOrNature) &&
    hasDescription &&
    hasPackages &&
    hasNetWeight &&
    hasRemos
  );
}
function checkType(packingList) {
  for (const x of packingList) {
    if (isNaN(Number(x.number_of_packages))) {
      x.number_of_packages = null;
    }
    if (isNaN(Number(x.total_net_weight_kg))) {
      x.total_net_weight_kg = null;
    }
  }
  return packingList;
}
module.exports = {
  failedParser,
  findParser,
  checkRequiredData,
  checkType,
};
