const parserModel = require("../../../../app/services/parser-model");
const parserFactory = require("../../../../app/services/parsers/parser-factory");
const { noMatchParsers } = require("../../../../app/services/model-parsers");
const { parsersExcel } = require("../../../../app/services/model-parsers");
const tjmorrisModel = require("../../test-data-and-results/models/tjmorris/model1");

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

  const emptyDataPackingListJson = {
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
        R: "Net Weight",
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
    ],
  };

  test("removes empty items", async () => {
    const result = await parserFactory.generateParsedPackingList(
      parsersExcel.TJMORRIS1,
      emptyDataPackingListJson,
    );

    expect(result.items).toHaveLength(1);
  });

  test("Not matched Excel file", async () => {
    const packingListJson = {};

    const result = await parserFactory.generateParsedPackingList(
      noMatchParsers.UNRECOGNISED,
      packingListJson,
    );

    expect(result.parserModel).toBe(parserModel.NOMATCH);
  });

  test("No remos pdf file", async () => {
    const packingListJson = {};

    const result = await parserFactory.generateParsedPackingList(
      noMatchParsers.NOREMOSPDF,
      packingListJson,
    );

    expect(result.parserModel).toBe(parserModel.NOREMOS);
  });

  test("all_required_fields_present true", async () => {
    const result = await parserFactory.generateParsedPackingList(
      parsersExcel.TJMORRIS1,
      packingListJson,
    );

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
    const result = await parserFactory.generateParsedPackingList(
      parsersExcel.TJMORRIS1,
      packingListJsonMissing,
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
    const result = await parserFactory.generateParsedPackingList(
      parsersExcel.TJMORRIS1,
      packingListJsonEmpty,
    );

    expect(result.business_checks.all_required_fields_present).toBeFalsy();
  });
});

describe("findParser", () => {
  test("Unrecognised extension", async () => {
    const packingListJson = {
      Sheet1: [
        {
          A: "Consignor / Place o f Despatch",
          B: "CONSIGNEE",
        },
      ],
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
        },
      ],
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
  });

  test("Unrecognised csv", async () => {
<<<<<<< HEAD
    const packingListJson = [
      {
        A: "Consignor / Place of Despatch",
        B: "CONSIGNEE",
      },
    ];
=======
    const packingListJson = [{
      A: "Consignor / Place of Despatch",
      B: "CONSIGNEE",
    }];
>>>>>>> ea4fbce8 (Improved test coverage)
    const fileName = "packingList.csv";

    const result = await parserFactory.findParser(packingListJson, fileName);

    expect(result.name).toBeTruthy();
  });
});
