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
              NIRMS: {
                value: "no",
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
              NIRMS: {
                value: "no",
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
        content: "RMS-GB-000008-001",
      },
      TotalNetWeightHeader: {
        content: "Tot Net Weight",
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
              NIRMS: {
                value: "no",
              },
            },
          },
        ],
      },
    },
  },
  nonNirms: {
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
              NIRMS: {
                value: "no",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 330M LATTE CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999991",
              },
              "Trays/Ctns": {
                value: 5,
              },
              "Tot Net Weight (Kg)": {
                content: "1.65",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "non-nirms",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 440M MOCHA CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999992",
              },
              "Trays/Ctns": {
                value: 8,
              },
              "Tot Net Weight (Kg)": {
                content: "3.52",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "non nirms",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 250M ESPRESSO CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999993",
              },
              "Trays/Ctns": {
                value: 6,
              },
              "Tot Net Weight (Kg)": {
                content: "1.5",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "red",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 300M AMERICANO CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999994",
              },
              "Trays/Ctns": {
                value: 4,
              },
              "Tot Net Weight (Kg)": {
                content: "1.2",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "r",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 200M MACCHIATO CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999995",
              },
              "Trays/Ctns": {
                value: 3,
              },
              "Tot Net Weight (Kg)": {
                content: "0.6",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "n",
              },
            },
          },
        ],
      },
    },
  },
  invalidNirms: {
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
              NIRMS: {
                value: "invalid",
              },
            },
          },
        ],
      },
    },
  },
  missingNirms: {
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
  missingCoO: {
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
              NIRMS: {
                value: "yes",
              },
              CountryOfOrigin: {
                value: "",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 330M LATTE CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999991",
              },
              "Trays/Ctns": {
                value: 5,
              },
              "Tot Net Weight (Kg)": {
                content: "1.65",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "nirms",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 440M MOCHA CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999992",
              },
              "Trays/Ctns": {
                value: 8,
              },
              "Tot Net Weight (Kg)": {
                content: "3.52",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "green",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 250M ESPRESSO CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999993",
              },
              "Trays/Ctns": {
                value: 6,
              },
              "Tot Net Weight (Kg)": {
                content: "1.5",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "y",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 300M AMERICANO CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999994",
              },
              "Trays/Ctns": {
                value: 4,
              },
              "Tot Net Weight (Kg)": {
                content: "1.2",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "g",
              },
            },
          },
        ],
      },
    },
  },
  invalidCoO: {
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
              NIRMS: {
                value: "yes",
              },
              CountryOfOrigin: {
                value: "INVALID",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 330M LATTE CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999991",
              },
              "Trays/Ctns": {
                value: 5,
              },
              "Tot Net Weight (Kg)": {
                content: "1.65",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "nirms",
              },
              CountryOfOrigin: {
                value: "INVALID",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 440M MOCHA CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999992",
              },
              "Trays/Ctns": {
                value: 8,
              },
              "Tot Net Weight (Kg)": {
                content: "3.52",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "green",
              },
              CountryOfOrigin: {
                value: "INVALID",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 250M ESPRESSO CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999993",
              },
              "Trays/Ctns": {
                value: 6,
              },
              "Tot Net Weight (Kg)": {
                content: "1.5",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "y",
              },
              CountryOfOrigin: {
                value: "INVALID",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 300M AMERICANO CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999994",
              },
              "Trays/Ctns": {
                value: 4,
              },
              "Tot Net Weight (Kg)": {
                content: "1.2",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "g",
              },
              CountryOfOrigin: {
                value: "INVALID",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 200M MACCHIATO CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999995",
              },
              "Trays/Ctns": {
                value: 3,
              },
              "Tot Net Weight (Kg)": {
                content: "0.6",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "no",
              },
              CountryOfOrigin: {
                value: "INVALID",
              },
            },
          },
        ],
      },
    },
  },
  xCoO: {
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
              NIRMS: {
                value: "yes",
              },
              CountryOfOrigin: {
                value: "X",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "SB* 330M LATTE CHILLED CUP",
              },
              "EU Commodity Code": {
                value: "2202999991",
              },
              "Trays/Ctns": {
                value: 5,
              },
              "Tot Net Weight (Kg)": {
                content: "1.65",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "nirms",
              },
              CountryOfOrigin: {
                value: "x",
              },
            },
          },
        ],
      },
    },
  },
  highRiskProducts: {
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
                value: "Safe Product 1",
              },
              "EU Commodity Code": {
                value: "012",
              },
              "Trays/Ctns": {
                value: 2,
              },
              "Tot Net Weight (Kg)": {
                content: "1.0",
              },
              "Treatment Type": {
                value: "HIGH_RISK_TREATMENT",
              },
              NIRMS: {
                value: "yes",
              },
              CountryOfOrigin: {
                value: "HIGH_RISK_ISO",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "High Risk Carrot Product",
              },
              "EU Commodity Code": {
                value: "012",
              },
              "Trays/Ctns": {
                value: 5,
              },
              "Tot Net Weight (Kg)": {
                content: "10.0",
              },
              "Treatment Type": {
                value: "Chilled",
              },
              NIRMS: {
                value: "yes",
              },
              CountryOfOrigin: {
                value: "VALID_ISO",
              },
            },
          },
          {
            properties: {
              "Description of Goods": {
                value: "High Risk Celery Product",
              },
              "EU Commodity Code": {
                value: "012",
              },
              "Trays/Ctns": {
                value: 8,
              },
              "Tot Net Weight (Kg)": {
                content: "15.0",
              },
              NIRMS: {
                value: "yes",
              },
              CountryOfOrigin: {
                value: "HIGH_RISK_ISO",
              },
            },
          },
        ],
      },
    },
  },
};
