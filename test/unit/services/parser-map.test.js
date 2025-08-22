const {
  mapPdfParser,
  extractNetWeightUnit,
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
