module.exports = {
  validModel: {
    fields: {
      PartialNIRMSNumber: {
        content: "KingdomRMS_ESTABLISHMENT_NORMS-GB-000040-",
      },
      PackingListContents: {
        values: [
          {
            properties: {
              "Part Description": {
                value: "SB* 220M CAPPUCI CHILLED CUP",
              },
              "Tariff Code": {
                value: "2202999990",
              },
              "Unit Qty": {
                value: 10,
              },
              "Net Weight (KG)": {
                content: "2.3275",
              },
            },
          },
        ],
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
  emptyModel: {
    fields: {
      PartialNIRMSNumber: {
        content: "KingdomRMS_ESTABLISHMENT_NORMS-GB-000040-",
      },
      PackingListContents: {
        values: [],
      },
    },
  },
  invalidModel_MissingColumnCells: {
    fields: {
      PartialNIRMSNumber: {
        content: "KingdomRMS_ESTABLISHMENT_NORMS-GB-000040-",
      },
      PackingListContents: {
        values: [
          {
            properties: {
              "Part Description": {
                value: "SB* 220M CAPPUCI CHILLED CUP",
              },
              "Tariff Code": {
                value: null,
              },
              "Unit Qty": {
                value: 10,
              },
              "Net Weight (KG)": {
                content: "2.3275",
              },
            },
          },
        ],
      },
    },
  },
};
