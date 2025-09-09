function combine(
  establishmentNumber,
  packingListContents,
  allRequiredFieldsPresent,
  ParserModel,
  establishmentNumbers = [],
  header = null,
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
    unitInHeader: header?.findUnitInHeader ?? false,
    validateCountryOfOrigin: header?.validateCountryOfOrigin ?? false,
    blanketNirms: header?.blanketNirms ?? false,
  };
}

module.exports = {
  combine,
};
