const MatcherResult = require("./matcher-result");
const ParserModel = require("./parser-model");
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
const JsonFile = require("../utilities/json-file");
const FileExtension = require("../utilities/file-extension");

const INPUT_DATA_SHEET = "Input Data Sheet";

const isNullOrUndefined = (value) => value === null || value === undefined;
function findParser(packingList, filename) {
  let parsedPackingList = failedParser();

  // Sanitised packing list (i.e. emove trailing spaces and empty cells)
  const packingListJson = JSON.stringify(packingList);
  const sanitisedPackingListJson = JsonFile.sanitises(packingListJson);
  const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);
  // Test for Excel spreadsheets
  if (FileExtension.isExcel(filename)) {
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
      CdsMatcher.matches(sanitisedPackingList, filename) ===
      MatcherResult.CORRECT
    ) {
      parsedPackingList = CdsParser.parse(
        sanitisedPackingList[Object.keys(sanitisedPackingList)[0]],
      );
    } else if (
      DavenportMatcher.matches(sanitisedPackingList, filename) ===
      MatcherResult.CORRECT
    ) {
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
    } else if (
      WarrensMatcher.matches(sanitisedPackingList, filename) ===
      MatcherResult.CORRECT
    ) {
      parsedPackingList = WarrensParser.parse(sanitisedPackingList);
    } else {
      console.info("Failed to parse packing list with filename: ", filename);
    }
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
