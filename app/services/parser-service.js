const MatcherResult = require("./matches-result");
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
const FowlerWelchMatcher = require("../services/matchers/fowlerwelch/model1/matcher");
const FowlerWelchParser = require("../services/parsers/fowlerwelch/model1/parser");
const NisaMatcher = require("../services/matchers/nisa/model1/matcher");
const NisaParser = require("../services/parsers/nisa/model1/parser");
const NisaMatcher2 = require("../services/matchers/nisa/model2/matcher");
const NisaParser2 = require("../services/parsers/nisa/model2/parser");
const NisaMatcher3 = require("../services/matchers/nisa/model3/matcher");
const NisaParser3 = require("../services/parsers/nisa/model3/parser");
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
const CombineParser = require("./parser-combine");

const CUSTOMER_ORDER = "Customer Order";
const INPUT_DATA_SHEET = "Input Data Sheet";

function findParser(result, filename) {
  let parsedPackingList = failedParser();
  let isParsed = false;

  if (TjMorrisMatcher.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches TJ Morris with filename: ", filename);
    parsedPackingList = TjMorrisParser.parse(result.Sheet1);
    isParsed = true;
  } else if (AsdaMatcher.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Asda Model 1 with filename: ", filename);
    parsedPackingList = AsdaParser.parse(result.PackingList_Extract);
    isParsed = true;
  } else if (AsdaMatcher2.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Asda Model 2 with filename: ", filename);
    parsedPackingList = AsdaParser2.parse(result.Sheet1);
    isParsed = true;
  } else if (
    SainsburysMatcher.matches(result, filename) === MatcherResult.CORRECT
  ) {
    console.info("Packing list matches Sainsburys with filename: ", filename);
    parsedPackingList = SainsburysParser.parse(result.Sheet1);
    isParsed = true;
  } else if (BandMMatcher.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches BandM with filename: ", filename);
    parsedPackingList = BandMParser.parse(result.Sheet1);
    isParsed = true;
  } else if (CoopMatcher.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Co-op with filename: ", filename);
    parsedPackingList = CoopParser.parse(result["Input Packing Sheet"]);
    isParsed = true;
  } else if (
    TescosMatcher.matches(result, filename) === MatcherResult.CORRECT
  ) {
    console.info(
      "Packing list matches Tesco Model 1 with filename: ",
      filename,
    );
    parsedPackingList = TescosParser.parse(result[INPUT_DATA_SHEET]);
    isParsed = true;
  } else if (
    TescosMatcher2.matches(result, filename) === MatcherResult.CORRECT
  ) {
    console.info(
      "Packing list matches Tesco Model 2 with filename: ",
      filename,
    );
    parsedPackingList = TescosParser2.parse(result.Sheet2);
    isParsed = true;
  } else if (
    TescosMatcher3.matches(result, filename) === MatcherResult.CORRECT
  ) {
    console.info(
      "Packing list matches Tesco Model 3 with filename: ",
      filename,
    );
    parsedPackingList = TescosParser3.parse(result[INPUT_DATA_SHEET]);
    isParsed = true;
  } else if (
    FowlerWelchMatcher.matches(result, filename) === MatcherResult.CORRECT
  ) {
    console.info("Packing list matches Fowler Welch with filename: ", filename);
    parsedPackingList = FowlerWelchParser.parse(result[CUSTOMER_ORDER]);
    isParsed = true;
  } else if (NisaMatcher.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Nisa with filename: ", filename);
    parsedPackingList = NisaParser.parse(result[Object.keys(result)[0]]);
    isParsed = true;
  } else if (NisaMatcher2.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Nisa Model 2 with filename: ", filename);
    parsedPackingList = NisaParser2.parse(result[Object.keys(result)[0]]);
    isParsed = true;
  } else if (NisaMatcher3.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Nisa Model 3 with filename: ", filename);
    parsedPackingList = NisaParser3.parse(result[Object.keys(result)[0]]);
    isParsed = true;
  } else if (
    BuffaloadMatcher.matches(result, filename) === MatcherResult.CORRECT
  ) {
    console.info(
      "Packing list matches Buffaload Logistics with filename: ",
      filename,
    );
    parsedPackingList = BuffaloadParser.parse(result.Tabelle1);
    isParsed = true;
  } else {
    console.info("Failed to parse packing list with filename: ", filename);
  }

  if (isParsed) {
    parsedPackingList.items = parsedPackingList.items.filter(
      (x) =>
        !(
          x.description === null &&
          x.nature_of_products === null &&
          x.type_of_treatment === null &&
          x.commodity_code === null &&
          x.number_of_packages === null &&
          x.total_net_weight_kg === null
        ),
    );

    parsedPackingList.business_checks.all_required_fields_present =
      checkRequiredData(parsedPackingList);
  }

  return { packingList: parsedPackingList, isParsed };
}

function failedParser() {
  return CombineParser.combine(null, [], false);
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

module.exports = {
  failedParser,
  findParser,
  checkRequiredData,
};
