const parserModel = require("../../../../app/services/parser-model");

module.exports = {
  invalidFileExtension: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: null,
    parserModel: parserModel.NOMATCH,
  },
};
