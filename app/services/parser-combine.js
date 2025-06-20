function combine(
  establishmentNumber,
  packingListContents,
  allRequiredFieldsPresent,
  ParserModel,
  establishmentNumbers = [],
  findUnitInHeader = false,
  reasonsForFailure = null,
) {
  return {
    registration_approval_number: establishmentNumber,
    items: packingListContents,
    business_checks: {
      all_required_fields_present: allRequiredFieldsPresent,
      failure_reasons: reasonsForFailure,
    },
    parserModel: ParserModel,
    establishment_numbers: establishmentNumbers,
    unitInHeader: findUnitInHeader ?? false,
  };
}

module.exports = {
  combine,
};
