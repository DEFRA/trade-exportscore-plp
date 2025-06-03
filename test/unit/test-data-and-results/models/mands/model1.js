module.exports = {
  validModel: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000008-001",
      },
      TotalNetWeightHeader: {
        content: "Tot Net Weight (Kg)",
      },
      PackingListContents: {
        values: [
          {
            properties: {
              "Description of Goods": {
                value: "SB* 220M CAPPUCI CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999990",
              },
              "Trays/Ctns": {
                value: 10,
              },
              "Tot Net Weight (Kg)": {
                content: "2.3275",
              },
              "Treatment Type": {
                value: "Chilled",
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
        content: "RMS-GB-000041-001",
      },
      TotalNetWeightHeader: {
        content: "Tot Net Weight (Kg)",
      },
    },
  },
  invalidModel_MissingRemosElement: {
    fields: {
      remosNumber: {},
    },
    TotalNetWeightHeader: {
      content: "Tot Net Weight (Kg)",
    },
  },
  emptyModel: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000008-001",
      },
      TotalNetWeightHeader: {
        content: "Tot Net Weight (Kg)",
      },
      PackingListContents: {
        values: [],
      },
    },
  },
  invalidModel_MissingColumnCells: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000008-001",
      },
      TotalNetWeightHeader: {
        content: "Tot Net Weight (Kg)",
      },
      PackingListContents: {
        values: [
          {
            properties: {
              "Description of Goods": {
                value: "SB* 220M CAPPUCI CHILLED CUP",
              },
              "EU Commodity Code": {
                value: null,
              },
              "Trays/Ctns": {
                value: 10,
              },
              "Tot Net Weight (Kg)": {
                content: "2.3275",
              },
              "Treatment Type": {
                value: "Chilled",
              },
            },
          },
        ],
      },
    },
  },
};
