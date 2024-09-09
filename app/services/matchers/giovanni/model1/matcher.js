const MatcherResult = require("../../../matches-result");
const { matchesHeader } = require("../../../matches-header");

function matchesModel(packingList, filename, remosNumber, trader) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    const establishmentNumberRow = packingList[sheet].findIndex((x) =>
      x.A?.startsWith("RMS-GB-000"),
    );

    if (
      establishmentNumberRow === -1 ||
      packingList[sheet][establishmentNumberRow].A !== remosNumber
    ) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      C: "DESCRIPTION",
      G: "Quantity",
      H: "Net Weight (KG)",
      E: "Commodity Code",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(`Packing list matches ${trader} with filename: `, filename);
    }
    return result;
  } catch (err) {
    console.log(err);
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.C === "DESCRIPTION";
}

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    "RMS-GB-000153",
    "Giovanni Model 1",
  );
}

module.exports = {
  matches,
  matchesModel,
};
