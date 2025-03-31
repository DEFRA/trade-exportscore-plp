const pdfHelper = require("../../../app/utilities/pdf-helper");

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
