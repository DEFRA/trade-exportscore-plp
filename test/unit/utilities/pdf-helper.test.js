const pdfHelper = require("../../../app/utilities/pdf-helper");

jest.mock("pdf.js-extract");

jest.mock("../../../app/services/model-headers-pdf", () => ({
  TestHeader: {
    headers: {
      Header1: {
        x: /Header1/,
        headerTextAlignment: "LL",
      },
      Header2: {
        x: /Header2/,
        headerTextAlignment: "LL",
      },
    },
    totals: /Totals/i,
    minHeadersY: 1,
    maxHeadersY: 3,
  },
}));

describe("findSmaller", () => {
  test.each([
    [1, 2, 1],
    [2, 1, 1],
    [undefined, 2, 2],
    [2, undefined, 2],
    [undefined, undefined, undefined],
  ])("returns smaller number", (a, b, expected) => {
    const result = pdfHelper.findSmaller(a, b);
    expect(result).toBe(expected);
  });
});

describe("removeEmptyStringElements", () => {
  test("return json without empty string", () => {
    const pageContent = [
      {
        str: "Text",
        width: 2,
      },
      {
        str: " ",
        width: 0,
      },
    ];

    const expected = [
      {
        str: "Text",
        width: 2,
      },
    ];

    const result = pdfHelper.removeEmptyStringElements(pageContent);

    expect(result).toMatchObject(expected);
  });
});

describe("getHeaders", () => {
  test("returns correct headers", () => {
    const pageContent = [
      {
        str: "Header1",
        x: 4,
        y: 1,
      },
      {
        str: "HeaderMax",
        x: 4,
        y: 3,
      },
      {
        str: "Header2",
        x: 6,
        y: 1,
      },
      {
        str: " ",
        x: 7,
        y: 2,
      },
    ];

    const expected = {
      4: "Heder1 HeaderMax",
      6: "Header2",
    };
    const result = pdfHelper.getHeaders(pageContent, "TestHeader");
    expect(result.toString()).toBe(expected.toString());
  });
});

describe("sanitise", () => {
  test("removes empty strings", () => {
    const pdfJson = {
      pages: [
        {
          content: [
            {
              str: "Test",
              width: 2,
              x: 1,
              y: 1,
            },
            {
              str: "",
              width: 0,
              x: 5,
              y: 3,
            },
          ],
        },
      ],
    };

    const expected = {
      pages: [
        {
          content: [
            {
              str: "Test",
              width: 2,
              x: 1,
              y: 1,
            },
          ],
        },
      ],
    };

    const result = pdfHelper.sanitise(pdfJson);
    expect(result).toMatchObject(expected);
  });

  test("orders correctly by x and y", () => {
    const pdfJson = {
      pages: [
        {
          content: [
            {
              str: "Test1",
              width: 2,
              x: 1,
              y: 4,
            },
            {
              str: "Test3",
              width: 2,
              x: 4,
              y: 1,
            },
            {
              str: "Test2",
              width: 2,
              x: 1,
              y: 1,
            },
            {
              str: "Test4",
              width: 2,
              x: 4,
              y: 4,
            },
          ],
        },
      ],
    };

    const expected = {
      pages: [
        {
          content: [
            {
              str: "Test2",
              width: 2,
              x: 1,
              y: 1,
            },
            {
              str: "Test3",
              width: 2,
              x: 4,
              y: 1,
            },
            {
              str: "Test1",
              width: 2,
              x: 1,
              y: 4,
            },
            {
              str: "Test4",
              width: 2,
              x: 4,
              y: 4,
            },
          ],
        },
      ],
    };

    const result = pdfHelper.sanitise(pdfJson);
    expect(result).toMatchObject(expected);
  });
});

describe("extractEstablishmentNumbers", () => {
  test("returns empty array for empty pdfJson", () => {
    const pdfJson = { pages: [] };
    const result = pdfHelper.extractEstablishmentNumbers(pdfJson);
    expect(result).toEqual([]);
  });

  test("extracts single establishment number from pdfJson", () => {
    const pdfJson = {
      pages: [
        {
          content: [{ str: "RMS-GB-000000-000" }, { str: "Some other text" }],
        },
      ],
    };

    const expected = ["RMS-GB-000000-000"];
    const result = pdfHelper.extractEstablishmentNumbers(pdfJson);
    expect(result).toEqual(expected);
  });

  test("extracts multiple establishment numbers from pdfJson", () => {
    const pdfJson = {
      pages: [
        {
          content: [
            { str: "RMS-GB-000000-000" },
            { str: "Some other text" },
            { str: "RMS-GB-000000-001" },
          ],
        },
      ],
    };

    const expected = ["RMS-GB-000000-000", "RMS-GB-000000-001"];
    const result = pdfHelper.extractEstablishmentNumbers(pdfJson);
    expect(result).toEqual(expected);
  });
});

describe("extractEstablishmentNumbersFromString", () => {
  test("returns empty array for empty pdfJson", () => {
    const pdfJson = { pages: [] };
    const result = pdfHelper.extractEstablishmentNumbersFromString(
      pdfJson,
      /RMS-GB-\d{6}-\d{3}/i,
    );
    expect(result).toEqual([]);
  });

  test("extracts single establishment number from pdfJson", () => {
    const pdfJson = {
      pages: [
        {
          content: [{ str: "RMS-GB-000000-000" }, { str: "Some other text" }],
        },
      ],
    };

    const expected = ["RMS-GB-000000-000"];
    const result = pdfHelper.extractEstablishmentNumbersFromString(
      pdfJson,
      /RMS-GB-\d{6}-\d{3}/i,
    );
    expect(result).toEqual(expected);
  });

  test("extracts multiple establishment numbers from pdfJson", () => {
    const pdfJson = {
      pages: [
        {
          content: [
            { str: "RMS-GB-000000-000" },
            { str: "Some other text" },
            { str: "RMS-GB-000000-001" },
          ],
        },
      ],
    };

    const expected = ["RMS-GB-000000-000", "RMS-GB-000000-001"];
    const result = pdfHelper.extractEstablishmentNumbersFromString(
      pdfJson,
      /RMS-GB-\d{6}-\d{3}/gi,
    );
    expect(result).toEqual(expected);
  });
});

describe("groupByYCoordinate", () => {
  test("returns empty array for null input", () => {
    const result = pdfHelper.groupByYCoordinate(null);
    expect(result).toEqual([]);
  });

  test("returns empty array for undefined input", () => {
    const result = pdfHelper.groupByYCoordinate(undefined);
    expect(result).toEqual([]);
  });

  test("returns empty array for empty array input", () => {
    const result = pdfHelper.groupByYCoordinate([]);
    expect(result).toEqual([]);
  });

  test("returns single object unchanged", () => {
    const textObjects = [{ x: 10, y: 20, str: "Test", width: 5 }];
    const result = pdfHelper.groupByYCoordinate(textObjects);
    expect(result).toEqual([{ x: 10, y: 20, str: "Test", width: 5 }]);
  });

  test("groups objects with same X coordinate within Y threshold", () => {
    const textObjects = [
      { x: 10, y: 20, str: "Line1", width: 5 },
      { x: 10, y: 25, str: "Line2", width: 6 },
      { x: 10, y: 28, str: "Line3", width: 7 },
    ];
    const result = pdfHelper.groupByYCoordinate(textObjects);
    expect(result).toHaveLength(1);
    expect(result[0].str).toBe("Line1 Line2 Line3");
    expect(result[0].x).toBe(10);
    expect(result[0].y).toBeCloseTo(24.33, 1);
    expect(result[0].width).toBe(7);
  });

  test("does not group objects with same X coordinate exceeding Y threshold", () => {
    const textObjects = [
      { x: 10, y: 20, str: "Line1", width: 5 },
      { x: 10, y: 35, str: "Line2", width: 6 },
    ];
    const result = pdfHelper.groupByYCoordinate(textObjects);
    expect(result).toHaveLength(2);
    expect(result[0].str).toBe("Line1");
    expect(result[1].str).toBe("Line2");
  });

  test("does not group objects with different X coordinates", () => {
    const textObjects = [
      { x: 10, y: 20, str: "Column1", width: 5 },
      { x: 50, y: 20, str: "Column2", width: 6 },
    ];
    const result = pdfHelper.groupByYCoordinate(textObjects);
    expect(result).toHaveLength(2);
    expect(result[0].str).toBe("Column1");
    expect(result[1].str).toBe("Column2");
  });

  test("creates multiple groups correctly", () => {
    const textObjects = [
      { x: 10, y: 20, str: "G1L1", width: 5 },
      { x: 10, y: 25, str: "G1L2", width: 6 },
      { x: 50, y: 20, str: "G2L1", width: 7 },
      { x: 50, y: 23, str: "G2L2", width: 8 },
    ];
    const result = pdfHelper.groupByYCoordinate(textObjects);
    expect(result).toHaveLength(2);
    expect(result[0].str).toBe("G1L1 G1L2");
    expect(result[0].x).toBe(10);
    expect(result[1].str).toBe("G2L1 G2L2");
    expect(result[1].x).toBe(50);
  });

  test("respects custom Y threshold parameter", () => {
    const textObjects = [
      { x: 10, y: 20, str: "Line1", width: 5 },
      { x: 10, y: 23, str: "Line2", width: 6 },
    ];
    // With threshold 2, should not group (diff is 3)
    const result1 = pdfHelper.groupByYCoordinate(textObjects, 2);
    expect(result1).toHaveLength(2);

    // With threshold 5, should group (diff is 3)
    const result2 = pdfHelper.groupByYCoordinate(textObjects, 5);
    expect(result2).toHaveLength(1);
    expect(result2[0].str).toBe("Line1 Line2");
  });

  test("calculates average Y coordinate correctly", () => {
    const textObjects = [
      { x: 10, y: 20, str: "Line1", width: 5 },
      { x: 10, y: 22, str: "Line2", width: 6 },
      { x: 10, y: 24, str: "Line3", width: 7 },
    ];
    const result = pdfHelper.groupByYCoordinate(textObjects);
    expect(result).toHaveLength(1);
    expect(result[0].y).toBe(22); // (20 + 22 + 24) / 3
  });

  test("uses maximum width from group", () => {
    const textObjects = [
      { x: 10, y: 20, str: "Short", width: 5 },
      { x: 10, y: 22, str: "Medium", width: 10 },
      { x: 10, y: 24, str: "Longest", width: 15 },
    ];
    const result = pdfHelper.groupByYCoordinate(textObjects);
    expect(result).toHaveLength(1);
    expect(result[0].width).toBe(15);
  });

  test("preserves other properties from first object in group", () => {
    const textObjects = [
      { x: 10, y: 20, str: "Line1", width: 5, fontName: "Arial", height: 12 },
      { x: 10, y: 22, str: "Line2", width: 6, fontName: "Times", height: 14 },
    ];
    const result = pdfHelper.groupByYCoordinate(textObjects);
    expect(result).toHaveLength(1);
    expect(result[0].fontName).toBe("Arial");
    expect(result[0].height).toBe(12);
  });

  test("handles unsorted input by sorting first", () => {
    const textObjects = [
      { x: 50, y: 25, str: "C", width: 5 },
      { x: 10, y: 20, str: "A", width: 6 },
      { x: 10, y: 22, str: "B", width: 7 },
    ];
    const result = pdfHelper.groupByYCoordinate(textObjects);
    expect(result).toHaveLength(2);
    expect(result[0].str).toBe("A B");
    expect(result[1].str).toBe("C");
  });
});
