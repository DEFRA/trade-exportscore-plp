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
const FowlerWelchMatcher = require("./fowlerwelch/matcher");
const FowlerWelchParser = require("./fowlerwelch/parser");
const FowlerWelchMatcher2 = require("./fowlerwelch/matcher2");
const FowlerWelchParser2 = require("./fowlerwelch/parser2");

const CUSTOMER_ORDER = "Customer Order";
const INPUT_DATA_SHEET = "Input Data Sheet";
const CUST_ORD_VITACRESS = "Cust Ord - Vitacress";

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
  } else if (
    FowlerWelchMatcher2.matches(result, filename) === MatcherResult.CORRECT
  ) {
    console.info(
      "Packing list matches Fowler Welch 2 with filename: ",
      filename,
    );
    parsedPackingList = FowlerWelchParser2.parse(result);
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
  //console.log(parsedPackingList)
  return { packingList: parsedPackingList, isParsed };
}

function failedParser() {
  return CombineParser.combine(null, [], false);
}
function parseAsdaModel1(packingListJson) {
  const establishmentNumber = packingListJson[1].D ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.A ?? null,
    nature_of_products: col.B ?? null,
    type_of_treatment: col.C ?? null,
    commodity_code: null,
    number_of_packages: col.F ?? null,
    total_net_weight_kg: col.G ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

function parseTescoModel1(packingListJson) {
  const packingListContentsRow = 5;
  const establishmentNumberRow = 3;
  const establishmentNumber =
    packingListJson[establishmentNumberRow].AT ?? null;
  const packingListContents = packingListJson
    .slice(packingListContentsRow)
    .map((col) => ({
      description: col.G ?? null,
      nature_of_products: null,
      type_of_treatment: col.AS ?? null,
      commodity_code: col.L ?? null,
      number_of_packages: col.BR ?? null,
      total_net_weight_kg: col.BU ?? null,
    }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

function parseTescoModel2(packingListJson) {
  const establishmentNumber = packingListJson[2].M ?? null;
  const packingListContents = packingListJson.slice(2).map((col) => ({
    description: col.F ?? null,
    nature_of_products: null,
    type_of_treatment: null,
    commodity_code: col.C ?? null,
    number_of_packages: col.H ?? null,
    total_net_weight_kg: col.K ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

function parseTescoModel3(packingListJson) {
  const establishmentNumber = packingListJson[3].E ?? null;
  const packingListContents = packingListJson.slice(5).map((col) => ({
    description: col.A ?? null,
    nature_of_products: null,
    type_of_treatment: col.C ?? null,
    commodity_code: col.B ?? null,
    number_of_packages: col.E ?? null,
    total_net_weight_kg: col.G ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

function matchesSainsburys(packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split(".").pop();
    if (fileExtension !== "xlsx") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1]?.N.replace(
      /\u200B/g,
      "",
    );
    const regex = /^RMS-GB-000094-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Delivery Date",
      B: "Load Ref\r\n(Trailer Number)",
      C: "Product Type / Category",
      D: "Product / Part Number",
      E: "Product / Part Number Description",
      F: "Packed Singles",
      G: "Packages",
      H: "Net\r\nWeight / Package KG",
      I: "Gross\r\nWeight / Package KG",
      J: "Packaging Type",
      K: "Excise Code",
      L: "Final Destination ID",
      M: "Dispatch Unit ID",
      N: "RMS Number (based on depot)",
      O: "Commodity Code",
    };

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) {
      return MatcherResult.WRONG_HEADER;
    } else {
      return MatcherResult.CORRECT;
    }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function parseSainsburys(packingListJson) {
  const establishmentNumber =
    packingListJson[1].N?.replace(/\u200B/g, "") ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.E ?? null,
    nature_of_products: col.C ?? null,
    type_of_treatment: null,
    commodity_code: col.O ?? null,
    number_of_packages: col.G ?? null,
    total_net_weight_kg: col.H ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

function matchesTjmorris(packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split(".").pop().toLowerCase();
    if (fileExtension !== "xls") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1]?.A;
    const regex = /^RMS-GB-000010-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Consignor / Place o f Despatch",
      B: "CONSIGNEE",
      C: "Trailer",
      D: "Seal",
      E: "Store",
      F: "STORENAME",
      G: "Order",
      H: "Cage/Ref",
      I: "Group",
      J: "TREATMENTTYPE",
      K: "Sub-Group",
      L: "Description",
      M: "Item",
      N: "Description",
      O: "Tariff/Commodity",
      P: "Cases",
      Q: "Gross Weight Kg",
      R: "Net Weight Kg",
      S: "Cost",
      T: COUNTRY_OF_ORIGIN,
      U: "VAT Status",
      V: "SPS",
      W: "Consignment ID",
      X: "Processed?",
      Y: "Created Timestamp",
    };

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) {
      return MatcherResult.WRONG_HEADER;
    } else {
      return MatcherResult.CORRECT;
    }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function parseTjmorris(packingListJson) {
  const establishmentNumber = packingListJson[1].A ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.N ?? null,
    nature_of_products: col.L ?? null,
    type_of_treatment: col.J ?? null,
    commodity_code: col.O ?? null,
    number_of_packages: col.P ?? null,
    total_net_weight_kg: col.R ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

function matchesFowlerWelch(packingListJson, filename) {
  try {
    const headerRowNumber = 44;
    const establishmentNumberRow = 45;
    // check for correct extension
    const fileExtension = filename.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber =
      packingListJson[CUSTOMER_ORDER][establishmentNumberRow].M;
    const regex = /^RMS-GB-000216-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Item",
      B: "Product code",
      C: "Commodity code",
      D: "Online Check",
      E: "Meursing code",
      F: "Description of goods",
      G: COUNTRY_OF_ORIGIN,
      H: "No. of pkgs ",
      I: "Type of pkgs",
      J: "Total Gross Weight",
      K: "Total Net Weight",
      L: "Total Line Value",
      M: "NIIRMS Dispatch number",
      N: "Treatment Type (Chilled /Ambient)",
      O: "NIRMS Lane (R/G)",
      P: "Secondary Qty",
      Q: "Cert Type Req",
      R: "Cert Number",
    };

    const originalHeader = packingListJson[CUSTOMER_ORDER][headerRowNumber];

    for (const key in header) {
      if (!originalHeader[key].startsWith(header[key])) {
        return MatcherResult.WRONG_HEADER;
      }
    }
    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function parseFowlerWelch(packingListJson) {
  const establishmentNumberRow = 45;
  const establishmentNumber = packingListJson[establishmentNumberRow].M ?? null;
  const packingListContents = packingListJson
    .slice(establishmentNumberRow)
    .map((col) => ({
      description: col.F ?? null,
      nature_of_products: null,
      type_of_treatment: col.N ?? null,
      commodity_code: col.C ?? null,
      number_of_packages: col.H ?? null,
      total_net_weight_kg: col.K ?? null,
    }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

function matchesNisa(packingListJson, filename) {
  const establishmentNumberRow = 1;
  try {
    // check for correct extension
    const fileExtension = filename.split(".").pop();
    if (fileExtension !== "xlsx") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const sheet = Object.keys(packingListJson)[0];
    const establishmentNumber =
      packingListJson[sheet][establishmentNumberRow].A;
    const regex = /^RMS-GB-000025-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "RMS_ESTABLISHMENT_NO",
      I: "PRODUCT_TYPE_CATEGORY",
      K: "PART_NUMBER_DESCRIPTION",
      L: "TARIFF_CODE_EU",
      M: "PACKAGES",
      O: "NET_WEIGHT_TOTAL",
    };

    for (const key in header) {
      if (
        !packingListJson[sheet][0] ||
        packingListJson[sheet][0][key] !== header[key]
      ) {
        return MatcherResult.WRONG_HEADER;
      }
    }

    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function matchesAsdaModel2(packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split(".").pop();
    if (fileExtension !== "xls") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1].H;
    const regex = /^RMS-GB-000015-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      B: "[Description Of All Retail Go",
      D: "[Nature Of Product]",
      F: "[Treatment Ty",
      H: "Establishment Number",
      J: "Cases",
      L: "Case Weight",
      N: "NET Weight",
    };

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) {
      return MatcherResult.WRONG_HEADER;
    } else {
      return MatcherResult.CORRECT;
    }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function parseAsdaModel2(packingListJson) {
  const establishmentNumber = packingListJson[1].H ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.B ?? null,
    nature_of_products: col.D ?? null,
    type_of_treatment: col.F ?? null,
    commodity_code: null,
    number_of_packages: col.J ?? null,
    total_net_weight_kg: col.N ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

function parseNisa(packingListJson) {
  const establishmentNumber = packingListJson[1].A ?? null;
  const packingListContents = packingListJson.slice(1).map((col) => ({
    description: col.K ?? null,
    nature_of_products: col.I ?? null,
    type_of_treatment: null,
    commodity_code: col.L ?? null,
    number_of_packages: col.M ?? null,
    total_net_weight_kg: col.O ?? null,
  }));

  return CombineParser.combine(establishmentNumber, packingListContents, true);
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
  parseAsdaModel1,
  matchesSainsburys,
  parseSainsburys,
  matchesTjmorris,
  parseTjmorris,
  matchesTescoModel1,
  matchesTescoModel2,
  matchesTescoModel3,
  parseTescoModel1,
  parseTescoModel2,
  parseTescoModel3,
  matchesAsdaModel2,
  parseAsdaModel2,
  matchesFowlerWelch,
  parseFowlerWelch,
  matchesBuffaloadLogistics,
  parseBuffaloadLogistics,
  findParser,
  checkRequiredData,
};
