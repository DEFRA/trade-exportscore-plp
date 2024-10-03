module.exports = {
  validModel: {
    fields: {
      PartialNIRMSNumber: {
        content: "KingdomRMS_ESTABLISHMENT_NORMS-GB-000040-",
      },
    },
  },
  invalidModel_WrongRemosNumber: {
    fields: {
      PartialNIRMSNumber: {
        content: "KingdomRMS_ESTABLISHMENT_NORMS-GB-000041-",
      },
    },
  },
  invalidModel_MissingRemosElement: {
    fields: {
      remosNumber: {},
    },
  },
};
