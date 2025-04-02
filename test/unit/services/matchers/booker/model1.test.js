const matcher = require("../../../../../app/services/matchers/booker/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/booker/model1");
const { extractPdf } = require("../../../../../app/utilities/pdf-helper");
const logger = require("../../../../../app/utilities/logger");

jest.mock("../../../../../app/utilities/pdf-helper", () => {
  const actual = jest.requireActual("../../../../../app/utilities/pdf-helper");
  return {
    ...actual,
    extractPdf: jest.fn(),
  };
});

const filename = "test.pdf";

describe("matches", () => {
  test("return correct", async () => {
    extractPdf.mockImplementationOnce(() => {
      return model.validModel;
    });
    const result = await matcher.matches({}, filename);
    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' matcher result for empty json", async () => {
    extractPdf.mockImplementationOnce(() => {
      return { pages: [] };
    });
    const result = await matcher.matches({}, filename);
    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment number", async () => {
    extractPdf.mockImplementationOnce(() => {
      return model.wrongEstablishment;
    });
    const result = await matcher.matches({}, filename);
    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' matcher result for incorrect header values", async () => {
    extractPdf.mockImplementationOnce(() => {
      return model.incorrectHeader;
    });
    const result = await matcher.matches({}, filename);
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return 'Generic Error' matcher result when an error occurs", async () => {
    const result = await matcher.matches(null, null);
    expect(result).toBe(matcherResult.GENERIC_ERROR);
  });

  test("should call logger.logError when an error is thrown", async () => {
    const logErrorSpy = jest.spyOn(logger, "logError");
    await matcher.matches(null, null);
    expect(logErrorSpy).toHaveBeenCalled();
  });
});
