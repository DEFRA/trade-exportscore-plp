const value = require("../../../../../app/config");

module.exports = {
  validModel: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000021-000",
      },
      PackingListContents: {
        values: [
          {
            properties: {
              "Short description": {
                value: "SB* 220M CAPPUCI CHILLED CUP",
              },
              Article: {
                value: "2202999990",
              },
              "ORDER QTY": {
                value: 10,
              },
              "TOTAL NET WEIGHT kg": {
                content: "2.3275",
              },
              "Treatment Type": {
                value: "Frozen",
              },
              "Nature of Product": {
                value: "Product",
              },
            },
          },
        ],
      },
    },
  },
  invalidModel_WrongRemosNumber: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000678-000",
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
      NIRMSNumber: {
        content: "RMS-GB-000021-000",
      },
      PackingListContents: {
        values: [],
      },
    },
  },
  invalidModel_MissingColumnCells: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000021-000",
      },
      PackingListContents: {
        values: [
          {
            properties: {
              "Short description": {
                value: "SB* 220M CAPPUCI CHILLED CUP",
              },
              Article: {
                value: null,
              },
              "ORDER QTY": {
                value: 10,
              },
              "TOTAL NET WEIGHT kg": {
                content: "2.3275",
              },
              "Treatment Type": {
                value: null,
              },
              "Nature of Product": {
                value: "Product",
              },
            },
          },
        ],
      },
    },
  },
};
