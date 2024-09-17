const parserModel = require("../../../app/services/parser-model");
const parseExcelPackingList = require("../../../app/services/parse-excel-packing-list");
const parserService = require("../../../app/services/parser-service");

describe("failedParser", () => {
  test("parses valid json", () => {
    const packingListJson = {
      registration_approval_number: null,
      items: [],
      business_checks: {
        all_required_fields_present: false,
      },
    };

    const result = parseExcelPackingList.failedParser();

    expect(result).toMatchObject(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toMatchObject([]);
    expect(result.business_checks.all_required_fields_present).toBeFalsy();
    expect(result.parserModel).toBe(parserModel.NOMATCH);
  });
});

describe("findParser", () => {
  test("removes empty items", () => {
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
    const filename = "packinglist.xls";

    const result = parserService.findParser(packingListJson, filename);
    expect(result.items).toHaveLength(2);
  });

  test("Not matched Excel file", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";

    const result = parserService.findParser(packingListJson, filename);
    expect(result.parserModel).toBe(parserModel.NOMATCH);
  });
});
