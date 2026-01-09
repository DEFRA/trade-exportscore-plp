const matcher = require("../../../../../app/services/matchers/mands/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/mands/model1");
const MatcherResult = require("../../../../../app/services/matcher-result");
const { extractPdf } = require("../../../../../app/utilities/pdf-helper");

jest.mock("../../../../../app/utilities/pdf-helper", () => {
  const actual = jest.requireActual("../../../../../app/utilities/pdf-helper");
  return {
    ...actual,
    extractPdf: jest.fn(),
  };
});

describe("matchesMandS", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [matcherResult.CORRECT, model.validModel],
    [MatcherResult.GENERIC_ERROR, {}],
    [
      matcherResult.WRONG_ESTABLISHMENT_NUMBER,
      model.invalidModel_WrongRemosNumber,
    ],
    [
      matcherResult.WRONG_ESTABLISHMENT_NUMBER,
      model.invalidModel_MissingRemosElement,
    ],
  ])("returns '%s' for mands model", async (expected, inputModel) => {
    const filename = "PackingList.xlsx";
    extractPdf.mockImplementation(() => {
      return inputModel;
    });

    const result = await matcher.matches({}, filename);

    expect(result).toEqual(expected);
  });
});
