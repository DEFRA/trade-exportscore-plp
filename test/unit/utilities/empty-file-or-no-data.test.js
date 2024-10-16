const emptyOrNoItems = require("../../../app/utilities/empty-file-or-no-data");
const matcherResult = require("../../../app/services/matcher-result");
const model = require("../test-data-and-results/models/asda/model1");

describe("empty file or no PL items", () => {
  test.each([
    { fileContent: undefined },
    { fileContent: null },
    { fileContent: [] },
    { fileContent: [{}] },
    { fileContent: {} },
  ])(
    "returns 'Empty File' matcher result for a file with '$fileContent' content",
    (emptyModel) => {
      const result = emptyOrNoItems.checkForPackingListItems(emptyModel);

      expect(result).toBe(matcherResult.EMPTY_FILE);
    },
  );
});
