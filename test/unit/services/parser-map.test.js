const regex = require("../../../app/utilities/regex");
const {
  mapPdfParser,
  extractNetWeightUnit,
  getBlanketValueFromOffset,
  isNotEmpty,
  extractCommodityCodeDigits,
} = require("../../../app/services/parser-map");

jest.mock("../../../app/services/model-headers-pdf", () => ({
  MODEL1: {
    headers: {
      description: "description",
    },
    findUnitInHeader: false,
  },
}));

jest.mock("../../../app/utilities/regex", () => ({
  findUnit: jest.fn(),
}));

describe("extractNetWeightUnit", () => {
  test("should return null when findUnitInHeader is false", () => {
    const packingListDocument = {
      fields: {
        TotalNetWeightHeader: {
          content: "Total Net Weight (kg)",
        },
      },
    };

    const result = extractNetWeightUnit(packingListDocument, "MODEL1");
    expect(result).toBeNull();
  });
});

describe("mapPdfParser", () => {
  test("should return empty array when PackingListContents.values is missing", () => {
    const testCaseModel = [
      {
        fields: {
          PackingListContents: {},
        },
      },
    ];

    testCaseModel.forEach((test) => {
      const result = mapPdfParser(test, "ICELAND1");
      expect(result).toEqual([]);
    });
  });

  test("should reset item numbers when page number changes", () => {
    const packingListDocument = {
      fields: {
        PackingListContents: {
          values: [
            {
              properties: {
                description: {
                  value: "Item 1",
                  boundingRegions: [{ pageNumber: 1 }],
                },
              },
            },
            {
              properties: {
                description: {
                  value: "Item 2",
                  boundingRegions: [{ pageNumber: 1 }],
                },
              },
            },
            {
              properties: {
                description: {
                  value: "Item 3",
                  boundingRegions: [{ pageNumber: 2 }],
                },
              },
            },
            {
              properties: {
                description: {
                  value: "Item 4",
                  boundingRegions: [{ pageNumber: 2 }],
                },
              },
            },
          ],
        },
      },
    };

    const result = mapPdfParser(packingListDocument, "MODEL1");

    // Verify row numbers reset on new page
    expect(result[0].row_location).toEqual({ rowNumber: 1, pageNumber: 1 });
    expect(result[1].row_location).toEqual({ rowNumber: 2, pageNumber: 1 });
    expect(result[2].row_location).toEqual({ rowNumber: 1, pageNumber: 2 }); // Should reset to 1
    expect(result[3].row_location).toEqual({ rowNumber: 2, pageNumber: 2 });
  });
});

describe("getBlanketValueFromOffset", () => {
  const mockPackingListJson = [
    { A: "Header1", B: "Header2", C: "Header3" },
    { A: "Data1", B: "Data2", C: "Data3" },
    { A: "Data4", B: "Target Value", C: "Data6" },
    { A: "Data7", B: "Data8", C: "Data9" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return value at correct offset position", () => {
    const mockHeader = {
      regex: /Header2/,
      valueCellOffset: {
        row: 2,
        col: 0,
      },
    };

    // Mock regex.positionFinder to return row 0, column B
    regex.positionFinder = jest.fn().mockReturnValue([0, "B"]);

    const result = getBlanketValueFromOffset(mockPackingListJson, mockHeader);

    expect(regex.positionFinder).toHaveBeenCalledWith(
      mockPackingListJson,
      mockHeader.regex,
    );
    expect(result).toBe("Target Value");
  });

  test("should handle negative column offset", () => {
    const mockHeader = {
      regex: /Header2/,
      valueCellOffset: {
        row: 1,
        col: -1,
      },
    };

    regex.positionFinder = jest.fn().mockReturnValue([0, "B"]);

    const result = getBlanketValueFromOffset(mockPackingListJson, mockHeader);

    expect(result).toBe("Data1");
  });

  test("should handle positive column offset", () => {
    const mockHeader = {
      regex: /Header1/,
      valueCellOffset: {
        row: 1,
        col: 1,
      },
    };

    regex.positionFinder = jest.fn().mockReturnValue([0, "A"]);

    const result = getBlanketValueFromOffset(mockPackingListJson, mockHeader);

    expect(result).toBe("Data2");
  });

  test("should handle zero offsets", () => {
    const mockHeader = {
      regex: /Header1/,
      valueCellOffset: {
        row: 0,
        col: 0,
      },
    };

    regex.positionFinder = jest.fn().mockReturnValue([0, "A"]);

    const result = getBlanketValueFromOffset(mockPackingListJson, mockHeader);

    expect(result).toBe("Header1");
  });

  test("should handle column offset that results in different letter", () => {
    const mockHeader = {
      regex: /Header1/,
      valueCellOffset: {
        row: 2,
        col: 2,
      },
    };

    regex.positionFinder = jest.fn().mockReturnValue([0, "A"]);

    const result = getBlanketValueFromOffset(mockPackingListJson, mockHeader);

    expect(result).toBe("Data6");
  });
});

describe("isNotEmpty", () => {
  test.each([
    [
      { A: "Some value", B: "Another value", C: "Third value" },
      { Prop1: "A", Prop2: "B" },
      "Some value",
    ],
    [
      { A: "Some value", C: "Third value" },
      { Prop1: "A", Prop2: "B" },
      "Some value",
    ],
    [
      { A: "Some value", B: "Another value" },
      { Prop1: "A", Prop2: "B" },
      "Some value",
    ],
    [
      { B: "Another value", C: "Third value" },
      { Prop1: "A", Prop2: "B" },
      "Another value",
    ],
    [{ C: "Third value" }, { Prop1: "A", Prop2: "B" }, undefined],
    [{}, { Prop1: "A", Prop2: "B" }, undefined],
    [
      { C: "Third value" },
      { Prop1: "A", Prop2: "B", Prop3: "C" },
      "Third value",
    ],
  ])(
    "Scenario 0: isNotEmpty(%p) should return %p",
    (inputRow, inputHeader, expected) => {
      const result = isNotEmpty(inputRow, inputHeader);
      expect(result).toBe(expected);
    },
  );
});

describe("extractCommodityCodeDigits", () => {
  test.each([
    ["12345GB", "12345"],
    ["IT", null],
    ["12345", "12345"],
  ])("extractCommodityCodeDigits(%p) should return %p", (input, expected) => {
    const result = extractCommodityCodeDigits(input);
    expect(result).toEqual(expected);
  });
});
