function combine(
  establishmentNumber,
  packingListContents,
  allRequiredFieldsPresent,
  ParserModel,
  establishmentNumbers = [],
  findUnitInHeader = false,
  validateCountryOfOrigin = false,
) {
  return {
    registration_approval_number: establishmentNumber,
    items: packingListContents,
    business_checks: {
      all_required_fields_present: allRequiredFieldsPresent,
      failure_reasons: null,
    },
    parserModel: ParserModel,
    establishment_numbers: establishmentNumbers,
    unitInHeader: findUnitInHeader ?? false,
    validateCountryOfOrigin: validateCountryOfOrigin ?? false,
  };
}

module.exports = {
  combine,
};
