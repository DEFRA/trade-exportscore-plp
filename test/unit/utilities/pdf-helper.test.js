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
