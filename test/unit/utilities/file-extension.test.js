const fileExtension = require("../../../app/utilities/file-extension");
const matcherResult = require("../../../app/services/matcher-result");

describe("file-extension-check", () => {
  test.each([
    ["test-file.xls", "xls", matcherResult.CORRECT],
    ["test-file.xlsX", "xlsx", matcherResult.CORRECT],
    ["test-file.xlsX", "xLsx", matcherResult.CORRECT],
    ["test-file.Xls", "xls", matcherResult.CORRECT],
    ["test-file.csv", "csv", matcherResult.CORRECT],
    ["test-file.Csv", "csv", matcherResult.CORRECT],
    ["test-file.CsV", "cSV", matcherResult.CORRECT],
    ["car", "xls", matcherResult.WRONG_EXTENSION],
    ["car.abc", "xls", matcherResult.WRONG_EXTENSION],
  ])(
    "matches: when the input is '%s' and the extension is '%s', the result should be '%s'",
    (filename, extension, expected) => {
      expect(fileExtension.matches(filename, extension)).toBe(expected);
    },
  );

  test.each([
    ["test-file.xls", true],
    ["test-file.xlsx", true],
    ["test-file.csv", false],
    ["test-file.pdf", false],
    ["test-file.abc", false],
    ["test-file", false],
  ])(
    "isExcel: when the input is '%s', the result should be '%s'",
    (filename, expected) => {
      expect(fileExtension.isExcel(filename)).toBe(expected);
    },
  );
});
