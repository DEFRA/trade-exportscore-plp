const pdfHelper = require("../../../app/utilities/pdf-helper");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();

jest.mock("pdf.js-extract");

jest.mock("../../../app/services/model-headers", () => ({
  TestHeader: {
    headers: {
      Header1: {
        regex: /Header1/,
        headerTextAlignment: "LL",
      },
      Header2: {
        regex: /Header2/,
        headerTextAlignment: "LL",
      },
    },
    totals: /Totals/i,
    minHeadersY: /Header1/i,
    maxHeadersY: /HeaderMax/i,
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

describe("findRowXFromHeaderAndTextAlignment", () => {
  test.each([
    [20, "Net"],
    [null, "Wrong"],
  ])("returns '%s' for left aligned header and text", (expected, str) => {
    const header = {
      regex: /Net/i,
      headerTextAlignment: "LL",
    };
    const pageContent = [
      {
        str: str,
        x: 20,
      },
    ];

    const result = pdfHelper.findRowXFromHeaderAndTextAlignment(
      pageContent,
      header,
    );
    expect(result).toBe(expected);
  });

  test.each([
    [18, "Net"],
    [null, "Wrong"],
  ])("returns '%s' for centre header and left text", (expected, str) => {
    const header = {
      regex: /Net/i,
      headerTextAlignment: "CL",
    };
    const pageContent = [
      {
        str: str,
        x: 20,
        y: 5,
      },
      {
        str: " ",
        x: 19,
        y: 6,
      },
      {
        str: "Some text",
        x: 18,
        y: 6,
      },
      {
        str: "Other text",
        x: 17,
        y: 6,
      },
    ];

    const result = pdfHelper.findRowXFromHeaderAndTextAlignment(
      pageContent,
      header,
    );
    expect(result).toBe(expected);
  });

  test("returns null for default", () => {
    const header = {
      regex: /Net/i,
      headerTextAlignment: "wrong",
    };

    const pageContent = [];

    const result = pdfHelper.findRowXFromHeaderAndTextAlignment(
      pageContent,
      header,
    );
    expect(result).toBeNull();
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

describe("mergeNeighbouringText", () => {
  test("returns one string", () => {
    const pageContent = [
      {
        str: " ",
        x: 1,
        y: 4,
        width: 1,
      },
      {
        str: "One",
        x: 2,
        y: 4,
        width: 1,
      },
      {
        str: "Long",
        x: 3,
        y: 4,
        width: 2,
      },
      {
        str: "String",
        x: 5,
        y: 4,
        width: 2,
      },
      {
        str: " ",
        x: 7,
        y: 4,
        width: 1,
      },
    ];

    const expected = [
      {
        str: " ",
        x: 1,
        y: 4,
        width: 1,
      },
      {
        str: "OneLongString",
        x: 2,
        y: 4,
        width: 5,
      },
      {
        str: " ",
        x: 7,
        y: 4,
        width: 1,
      },
    ];

    const result = pdfHelper.mergeNeighbouringText(pageContent);

    expect(result).toMatchObject(expected);
  });
});

describe("getXsForRows", () => {
  test("returns correct xs", () => {
    const pageContent = [
      {
        str: "Header1",
        x: 1,
      },
      {
        str: "Header2",
        x: 5,
      },
    ];

    const expected = {
      Header1: 1,
      Header2: 5,
    };

    const result = pdfHelper.getXsForRows(pageContent, "TestHeader");

    expect(result).toMatchObject(expected);
  });
});

describe("getYsForRows", () => {
  test("returns correct ys", () => {
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
        str: "Header1Data2",
        x: 4,
        y: 5,
      },
      {
        str: "Header1Data2",
        x: 4,
        y: 6,
      },
      {
        str: "Totals",
        x: 1,
        y: 9,
      },
    ];

    const expected = [5, 6];
    const result = pdfHelper.getYsForRows(pageContent, "TestHeader");
    expect(result.toString()).toBe(expected.toString());
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

    const expected = ["Header1 HeaderMax", "Header2"];
    const result = pdfHelper.getHeaders(pageContent, "TestHeader");
    expect(result.toString()).toBe(expected.toString());
  });
});

// describe("extractPdf", () => {
//   test("returns json", async () => {
//     const pageContent = {
//       pages: [
//         {
//           content: {},
//         },
//       ],
//     };
//     const mockBuffer = Buffer.from("mock data");
//     const mockExtractBuffer = jest
//       .spyOn(pdfExtract, "extractBuffer")
//       .mockResolvedValue(pageContent);

//     const result = await pdfHelper.extractPdf(mockBuffer);

//     expect(mockExtractBuffer).toHaveBeenCalledWith(mockBuffer);
//     expect(result).toEqual(pageContent);

//     mockExtractBuffer.mockRestore();
//   });
// });

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

  test("merges neighbouring text", () => {
    const pdfJson = {
      pages: [
        {
          content: [
            {
              str: "Test1",
              width: 2,
              x: 1,
              y: 1,
            },
            {
              str: "Test2",
              width: 2,
              x: 3,
              y: 1,
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
              str: "Test1Test2",
              width: 4,
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
});
