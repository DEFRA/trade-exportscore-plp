const file_extension = require("../../../app/utilities/file-extension");
const matcher_result = require("../../../app/services/matcher-result");

describe("file-extension-check", () => {
  test.each([
    ["test-file.xls", "xls", matcher_result.CORRECT],
    ["test-file.xlsX", "xlsx", matcher_result.CORRECT],
    ["test-file.xlsX", "xLsx", matcher_result.CORRECT],
    ["test-file.Xls", "xls", matcher_result.CORRECT],
    ["test-file.csv", "csv", matcher_result.CORRECT],
    ["test-file.Csv", "csv", matcher_result.CORRECT],
    ["test-file.CsV", "cSV", matcher_result.CORRECT],
    ["car", "xls", matcher_result.WRONG_EXTENSION],
    ["car.abc", "xls", matcher_result.WRONG_EXTENSION],
  ])(
    "matches: when the input is '%s' and the extension is '%s', the result should be '%s'",
    (filename, extension, expected) => {
      expect(file_extension.matches(filename, extension)).toBe(expected);
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
      expect(file_extension.isExcel(filename)).toBe(expected);
    },
  );
});
