
function combine(
  establishmentNumber,
  packingListContents,
  allRequiredFieldsPresent,
) {
  return {
    registration_approval_number: establishmentNumber,
    items: packingListContents,
    business_checks: {
      all_required_fields_present: allRequiredFieldsPresent,
    },
  };
}

module.exports = {
  combine,
};

