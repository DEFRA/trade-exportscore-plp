module.exports = {
  validModel: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000021-000",
      },
      TotalNetWeightHeader: {
        content: "TOTAL NET WEIGHT kg",
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
              "GB Place of Dispatch": {
                value: "RMS-GB-000021-001",
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
      TotalNetWeightHeader: {
        content: "TOTAL NET WEIGHT kg",
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
      TotalNetWeightHeader: {
        content: "TOTAL NET WEIGHT kg",
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
      TotalNetWeightHeader: {
        content: "TOTAL NET WEIGHT kg",
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
              "GB Place of Dispatch": {
                value: "RMS-GB-000021-001",
              },
            },
          },
        ],
      },
    },
  },
  invalidModel_MissingAllRemos: {
    fields: {
      NIRMSNumber: {
        content: null,
      },
      TotalNetWeightHeader: {
        content: "TOTAL NET WEIGHT kg",
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
              "GB Place of Dispatch": {
                value: "RMS-GB-000021-000",
              },
            },
          },
        ],
      },
    },
  },
  missingKgunit: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000021-000",
      },
      TotalNetWeightHeader: {
        content: "TOTAL NET WEIGHT",
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
              "GB Place of Dispatch": {
                value: "RMS-GB-000021-001",
              },
            },
          },
        ],
      },
    },
  },
};
