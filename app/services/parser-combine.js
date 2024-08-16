function combine(
  establishmentNumber,
  packingListContents,
  allRequiredFieldsPresent,
  matchedModel,
) {
  return {
    registration_approval_number: establishmentNumber,
    items: packingListContents,
    business_checks: {
      all_required_fields_present: allRequiredFieldsPresent,
    },
    parserModel: matchedModel,
  };
}

module.exports = {
  combine,
};
