const parserModel = require("../../../../app/services/parser-model");
const parserFactory = require("../../../../app/services/parsers/parser-factory");
const { parsersExcel, parsersPdf } = require("../../../../app/services/model-parsers");
const tjmorrisModel = require("../../test-data-and-results/models/tjmorris/model1");
const icelandModel = require("../../test-data-and-results/models/iceland/model1");

jest.mock("../../../../app/services/document-intelligence");

const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../../../app/services/document-intelligence");
const MatcherResult = require("../../../../app/services/matcher-result");

createDocumentIntelligenceClient.mockImplementation(() => {
  return jest.fn();
});

const config = require("../../../../app/config");


describe("parsePackingList - e2e", () => {
  const filename = "packinglist.xls";
  const packingListJson = {
    Sheet1: [
      {
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
        T: "Country of Origin",
        U: "VAT Status",
        V: "SPS",
        W: "Consignment ID",
        X: "Processed?",
        Y: "Created Timestamp",
      },
      {
        A: "RMS-GB-000010-001",
        J: "CHILLED",
        L: "Description",
        N: "Description",
        O: "0408192000",
        P: "2",
        R: "1.4",
      },
      {
        A: null,
        J: null,
        L: null,
        N: null,
        O: null,
        P: null,
        R: null,
      },
      {
        A: "RMS-GB-000010-001",
        J: "FRESH PRODUCTS",
        L: "LETTUCE & BAGGED SALADS",
        N: "FLORETTE SWEET & CRUNCHY 250G",
        O: "1602906100",
        P: "4",
        R: "8",
      },
    ],
  };

  test("removes empty items", async () => {
    const result = await parserFactory.parsePackingList(packingListJson, filename);

    expect(result.items).toHaveLength(2);
  });

  test("Not matched Excel file", async () => {
    const packingListJson = {};

    const result = await parserFactory.parsePackingList(packingListJson, filename);

    expect(result.parserModel).toBe(parserModel.NOMATCH);
  });

  test("all_required_fields_present true", async () => {
    const result = await parserFactory.parsePackingList(packingListJson, filename);

    expect(result.business_checks.all_required_fields_present).toBeTruthy();
  });

  test("all_required_fields_present false for missing data", async () => {
    const packingListJsonMissing = {
      Sheet1: [
        {
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
          T: "Country of Origin",
          U: "VAT Status",
          V: "SPS",
          W: "Consignment ID",
          X: "Processed?",
          Y: "Created Timestamp",
        },
        {
          A: "RMS-GB-000010-001",
          J: "CHILLED",
          L: "Description",
          N: "Description",
          O: "0408192000",
          P: "2",
          R: "1.4",
        },
        {
          A: "RMS-GB-000010-001",
          J: "FRESH PRODUCTS",
          L: "LETTUCE & BAGGED SALADS",
          N: "FLORETTE SWEET & CRUNCHY 250G",
          O: null,
          P: null,
          R: "8",
        },
      ],
    };
    const result = await parserFactory.parsePackingList(
      packingListJsonMissing,
      filename,
    );

    expect(result.business_checks.all_required_fields_present).toBeFalsy();
  });

  test("all_required_fields_present false for empty sheet", async () => {
    const packingListJsonEmpty = {
      Sheet1: [
        {
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
          T: "Country of Origin",
          U: "VAT Status",
          V: "SPS",
          W: "Consignment ID",
          X: "Processed?",
          Y: "Created Timestamp",
        },
      ],
    };
    const result = await parserFactory.parsePackingList(
      packingListJsonEmpty,
      filename,
    );

    expect(result.business_checks.all_required_fields_present).toBeFalsy();
  });
});

describe("sanitizeInput", () => {

  test("sanitize a pdf - no change", async () => {
    const filename = "packinglist.pdf";
    const packingListJson = {
      Sheet1: [
        {
          A: "Consignor / Place o f Despatch",
          B: "CONSIGNEE",
          C: "Trailer",
          D: "Seal"
        },
        {
          A: "Col A",
          B: "Col B",
          C: "Col C",
          D: "Col D"
        }
      ]
    };

    const result = parserFactory.sanitizeInput(packingListJson, filename);

    expect(result).toBe(packingListJson);
  })

  test("sanitize an excel", async () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
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
          T: "Country of Origin",
          U: "VAT Status",
          V: "SPS",
          W: "Consignment ID",
          X: "Processed?",
          Y: "Created Timestamp",
        },
        {
          A: "RMS-GB-000010-001",
          J: "CHILLED",
          L: " Description",
          N: "Description ",
          O: "0408192000",
          P: "2",
          R: "1.4",
          T: ""
        }
      ]
    };

    const result = await parserFactory.sanitizeInput(packingListJson, filename);

    expect(result.Sheet1[1].L).toBe("Description");
    expect(result.Sheet1[1].N).toBe("Description");
    expect(result.Sheet1[1].T).toBeNull();
  });
});

describe("findParser", () => {
  test("Unrecognised extension", async () => {
    const packingListJson = {
      Sheet1: [
        {
          A: "Consignor / Place o f Despatch",
          B: "CONSIGNEE",
        }
      ]
    };
    const fileName = "packingList.txt";

    const result = await parserFactory.findParser(packingListJson, fileName);

    expect(result.name).toBeTruthy();
  });

  test("Unrecognised excel", async () => {
    const packingListJson = {
      Sheet1: [
        {
          A: "Consignor / Place o f Despatch",
          B: "CONSIGNEE",
        }
      ]
    };
    const fileName = "packingList.xls";

    const result = await parserFactory.findParser(packingListJson, fileName);

    expect(result.name).toBeTruthy();
  });

  test("TJMORRIS1 excel Parser", async () => {
    const filename = "packinglist.xls";
    const packingListJson = tjmorrisModel.validModel;

    const result = await parserFactory.findParser(packingListJson, filename);

    expect(result).toBe(parsersExcel.TJMORRIS1);
  })

  test("ICELAND pdf Parser with DI", async () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};

    runAnalysis.mockImplementation((client, modelId, fileBuffer) => {
      if (modelId === "iceland-requireddataonly-stringsintsandnumbers") {
        return icelandModel.validModel;
      } else {
        return {
          fields: {}
        };
      }

    });

    config.isDiEnabled = true;
    const result = await parserFactory.findParser(packingListJson, filename);
    config.isDiEnabled = false;

    expect(result).toBe(parsersPdf.ICELAND);
  })

  test("ICELAND pdf Parser without DI", async () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};

    runAnalysis.mockImplementation((client, modelId, fileBuffer) => {
      if (modelId === "iceland-requireddataonly-stringsintsandnumbers") {
        return icelandModel.validModel;
      } else {
        return {
          fields: {}
        };
      }

    });

    const result = await parserFactory.findParser(packingListJson, filename);

    expect(result.name).toBeTruthy();
  })

})