const matcher = require("../../../../../app/services/matchers/sainsburys/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/sainsburys/model1");
const logger = require("../../../../../app/utilities/logger");

const trader = "Sainsburys";
const modelNumber = 1;
const traderAndModelNumber = `${trader}-Model-${modelNumber}`;
const filename = `packinglist${traderAndModelNumber}.xls`;

describe(`matches-${traderAndModelNumber}`, () => {
  test("returns 'Correct' matcher result for valid model", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' matcher result for empty json", () => {
    const packingListJson = {};

    const result = matcher.matches(
      packingListJson,
      `emptyfilename-${filename}`,
    );

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Valid Header, no data' matcher result for file without items", () => {
    const result = matcher.matches(model.validHeadersNoData, filename);

    expect(result).toBe(matcherResult.VALID_HEADERS_NO_DATA);
  });

  test("returns 'Wrong Establishment Number' matcher result for invalid establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          N: "Incorrect",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values", () => {
    const packingListJson = {
      Sheet1: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Product / Part Number",
          E: "Product / Part Number Description",
          F: "Packed Singles",
          G: "Packages",
          H: "Net\nWeight / Package KG",
          I: "Gross\nWeight / Package KG",
          J: "Packaging Type",
          K: "Excise Code",
          L: "Final Destination ID",
          M: "Dispatch Unit ID",
          N: "RMS Number (based on depot)",
          O: "Commodity Code",
        },
        {
          N: "RMS-GB-000094-001",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("should call logger.log_error when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "log_error");

    matcher.matches(null, null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
