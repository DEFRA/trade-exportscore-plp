const MatcherResult = require("../services/matches-result");
const AsdaMatcher = require("../services/matchers/asda/model1/matcher");
const AsdaParser = require("../services/parsers/asda/model1/parser");
const AsdaMatcher2 = require("../services/asda/model2/matcher");
const AsdaParser2 = require("../services/parsers/asda/model2/parser");
const NisaMatcher = require("../services/matchers/nisa/model1/matcher");
const NisaParser = require("../services/parsers/nisa/model1/parser");
const NisaMatcher2 = require("../services/nisa/model2/matcher");
const NisaParser2 = require("../services/parsers/nisa/model2/parser");
const CombineParser = require("../services/parser-combine");

const CUSTOMER_ORDER = "Customer Order";
const INPUT_DATA_SHEET = "Input Data Sheet";

function findParser(result, filename) {
  let parsedPackingList = failedParser();
  let isParsed = false;

  if (matchesTjmorris(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches TJ Morris with filename: ", filename);
    parsedPackingList = parseTjmorris(result.Sheet1);
    isParsed = true;
  } else if (AsdaMatcher.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Asda Model 1 with filename: ", filename);
    parsedPackingList = AsdaParser.parse(result.PackingList_Extract);
    isParsed = true;
  } else if (AsdaMatcher2.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Asda Model 2 with filename: ", filename);
    parsedPackingList = AsdaParser2.parse(result.Sheet1);
    isParsed = true;
  } else if (matchesSainsburys(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Sainsburys with filename: ", filename);
    parsedPackingList = parseSainsburys(result.Sheet1);
    isParsed = true;
  } else if (matchesBandM(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches BandM with filename: ", filename);
    parsedPackingList = parseBandM(result.Sheet1);
    isParsed = true;
  } else if (matchesTescoModel1(result, filename) === MatcherResult.CORRECT) {
    console.info(
      "Packing list matches Tesco Model 1 with filename: ",
      filename,
    );
    parsedPackingList = parseTescoModel1(result[INPUT_DATA_SHEET]);
    isParsed = true;
  } else if (matchesTescoModel2(result, filename) === MatcherResult.CORRECT) {
    console.info(
      "Packing list matches Tesco Model 2 with filename: ",
      filename,
    );
    parsedPackingList = parseTescoModel2(result.Sheet2);
    isParsed = true;
  } else if (matchesTescoModel3(result, filename) === MatcherResult.CORRECT) {
    console.info(
      "Packing list matches Tesco Model 3 with filename: ",
      filename,
    );
    parsedPackingList = parseTescoModel3(result[INPUT_DATA_SHEET]);
    isParsed = true;
  } else if (matchesFowlerWelch(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Fowler Welch with filename: ", filename);
    parsedPackingList = parseFowlerWelch(result[CUSTOMER_ORDER]);
    isParsed = true;
  } else if (NisaMatcher.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Nisa with filename: ", filename);
    parsedPackingList = NisaParser.parse(result[Object.keys(result)[0]]);
    isParsed = true;
  } else if (NisaMatcher2.matches(result, filename) === MatcherResult.CORRECT) {
    console.info("Packing list matches Nisa2 with filename: ", filename);
    parsedPackingList = NisaParser2.parse(result[Object.keys(result)[0]]);
    isParsed = true;
  } else if (matchesBuffaloadLogistics(result, filename) === MatcherResult.CORRECT) {
    console.info(
      "Packing list matches Buffaload Logistics with filename: ",
      filename,
    );
    parsedPackingList = parseBuffaloadLogistics(result.Tabelle1);
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
