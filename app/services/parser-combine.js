function combine(
  establishmentNumber,
  packingListContents,
  allRequiredFieldsPresent,
  ParserModel,
  establishmentNumbers = [],
  findUnitInHeader = false,
  validateCountryOfOrigin = false,
  blanketNirms = false,
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
    blanketNirms: blanketNirms ?? false,
  };
}

module.exports = {
  combine,
};
