module.exports = {
  validModel: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000077-001",
      },
      PackingListContents: {
        values: [
          {
            properties: {
              Description: {
                value: "Aero Melts Milk Bag PM135",
              },
              "Unit Quantity": {
                value: "1",
              },
              "Net Weight (Kilos)": {
                content: 1.067,
              },
              "Commodity Code": {
                value: "1806329000",
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
        content: "RMS-GB-000011-001",
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
        content: "RMS-GB-000077-001",
      },
      PackingListContents: {
        values: [],
      },
    },
  },
  invalidModel_MissingColumnCells: {
    fields: {
      NIRMSNumber: {
        content: "RMS-GB-000077-001",
      },
      PackingListContents: {
        values: [
          {
            properties: {
              Description: {
                value: "Aero Melts Milk Bag PM135",
              },
              "Unit Quantity": {
                value: null,
              },
              "Net Weight (Kilos)": {
                content: 1.067,
              },
              "Commodity Code": {
                value: "1806329000",
              },
            },
          },
        ],
      },
    },
  },
};
