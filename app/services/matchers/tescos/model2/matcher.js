const MatcherResult = require("../../../matcher-result");
const { matchesHeader } = require("../../../matches-header");
function matches(packingListJson, filename) {
  try {
    const sheet = Object.keys(packingListJson)[0];
    // check for correct establishment number
    const establishmentNumberRow = 2;
    const establishmentNumber =
      packingListJson[sheet][establishmentNumberRow].M;
    const regex = /^RMS-GB-000015-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      C: "Commodity code",
      F: "Description of goods",
      H: "No. of pkgs",
      K: "Total Net Weight",
    };

    const result = matchesHeader(header, packingListJson[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Tesco Model 2 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.F === "Description of goods";
}

module.exports = {
  matches,
};
