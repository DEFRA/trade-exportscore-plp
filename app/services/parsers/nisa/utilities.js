const validatorUtilities =  require("../../validators/packing-list-validator-utilities");

function isTotalRow(item) {
    return validatorUtilities.hasMissingDescription(item) &&
      validatorUtilities.hasMissingIdentifier(item) &&
      !validatorUtilities.hasMissingNetWeight(item) &&
      !validatorUtilities.hasMissingPackages(item);
  }

  module.exports = {
    isTotalRow
  }