const netWeight = /Net Weight/i;

const headers = {
  ICELAND1: {
    establishmentNumber: {
      regex: /RMS-GB-000040/i,
      value: "RMS-GB-000040",
    },
    headers: {
      description: "Part Description",
      commodity_code: "Tariff Code",
      number_of_packages: "Unit Qty",
      total_net_weight_kg: "Net Weight (KG)",
    },
    findUnitInHeader: true,
    modelId: "iceland1-v4",
  },
  MANDS1: {
    establishmentNumber: {
      regex: /^(?:Depot Approval Number:\s)?(RMS-GB-000008-\d{3})$/i,
    },
    headers: {
      description: "Description of Goods",
      commodity_code: "EU Commodity Code",
      type_of_treatment: "Treatment Type",
      number_of_packages: "Trays/Ctns",
      total_net_weight_kg: "Tot Net Weight (Kg)",
    },
    findUnitInHeader: true,
    modelId: "mands1-v4",
  },
  BOOKER1: {
    establishmentNumber: {
      regex: /^RMS-GB-000077-\d{3}$/i,
    },
    headers: {
      description: {
        x: /Description/i,
        x1: 160,
        x2: 340,
        regex: /Description/i,
      },
      commodity_code: {
        x: /Commodity Code/i,
        x1: 500,
        x2: 540,
        regex: /Commodity Code/i,
      },
      number_of_packages: {
        x: /Quantity/i,
        x1: 340,
        x2: 360,
        regex: /Unit Quantity/i,
      },
      total_net_weight_kg: {
        x: /Net/i,
        x1: 430,
        x2: 455,
        regex: netWeight,
      },
    },
    totals: /^0 Boxes/i,
    minHeadersY: 192,
    maxHeadersY: 212,
    findUnitInHeader: true,
  },
  BOOKER1L: {
    establishmentNumber: {
      regex: /^RMS-GB-000077-\d{3}$/i,
    },
    totals: /^0 Boxes/i,
    minHeadersY: 189,
    maxHeadersY: 208,
    findUnitInHeader: true,
    headers: {
      description: {
        x: /Description/i,
        x1: 155,
        x2: 335,
        regex: /Description/i,
      },
      commodity_code: {
        x: /Commodity Code/i,
        x1: 490,
        x2: 580,
        regex: /Commodity Code/i,
      },
      number_of_packages: {
        x: /Quantity/i,
        x1: 335,
        x2: 365,
        regex: /Unit Quantity/i,
      },
      total_net_weight_kg: {
        x: /Net/i,
        x1: 420,
        x2: 445,
        regex: netWeight,
      },
      type_of_treatment: {
        x: /Treatment Type/i,
        x1: 660,
        x2: 730,
        regex: /Treatment Type/i,
      },
    },
  },
  GIOVANNI3: {
    establishmentNumber: {
      regex: /RMS-GB-000149(-\d{3})?/i,
    },
    headers: {
      description: {
        x: /DESCRIPTION/i,
        x1: 125,
        x2: 255,
        regex: /DESCRIPTION/i,
      },
      commodity_code: {
        x: /Commodity Code/i,
        x1: 255,
        x2: 350,
        regex: /Commodity Code/i,
      },
      number_of_packages: {
        x: /Quantity/i,
        x1: 355,
        x2: 389,
        regex: /Quantity/i,
      },
      total_net_weight_kg: {
        x: /Net/i,
        x1: 389,
        x2: 439,
        regex: netWeight,
      },
    },
    minHeadersY: 280,
    maxHeadersY: 300,
    findUnitInHeader: true,
  },
  GREGGS1: {
    establishmentNumber: {
      regex: /^(RMS-GB-000021-\d{3})(?: Packing List)?$/i,
    },
    headers: {
      commodity_code: "Article",
      description: "Short description",
      number_of_packages: "ORDER QTY",
      total_net_weight_kg: "TOTAL NET WEIGHT kg",
      type_of_treatment: "Treatment Type",
      nature_of_products: "Nature of Product",
      remos_number: "GB Place of Dispatch",
    },
    findUnitInHeader: true,
    modelId: "greggs1-v5",
  },
};

module.exports = headers;
