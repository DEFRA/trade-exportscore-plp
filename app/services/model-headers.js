const descriptionRegex = /Product\/ Part Number description/i;
const descriptionOfGoodsRegex = /Description of goods/i;
const commodityCodeRegex = /Commodity Code/i;
const noOfPackagesRegex = /No. of pkgs/i;
const netWeightRegex = /Net Weight \(KG\)/i;
const netWeight = /Net Weight/i;

const headers = {
  ASDA1: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/i,
    },
    regex: {
      description: /\[Description Of All Retail Goods\]/i,
      nature_of_products: /\[Nature Of Product\]/i,
      type_of_treatment: /\[Treatment Type\]/i,
      number_of_packages: /\[Number of Packages\]/i,
      total_net_weight_kg: /\[Net Weight\]/i,
    },
    total_net_weight_unit: /\[kilograms\/grams\]/i,
  },
  ASDA2: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/i,
    },
    regex: {
      description: /\[Description Of All Retail Go/i,
      nature_of_products: /\[Nature Of Product\]/i,
      type_of_treatment: /\[Treatment Ty/i,
      number_of_packages: /Cases/i,
      total_net_weight_kg: netWeight,
    },
    findUnitInHeader: true,
  },
  BANDM1: {
    establishmentNumber: {
      regex: /RMS-GB-000005-(\d{3})?/i,
    },
    regex: {
      description: /ITEM DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /TOTAL NUMBER OF CASES/i,
      total_net_weight_kg: netWeight,
    },
    findUnitInHeader: true,
  },
  BOOTS1: {
    establishmentNumber: {
      regex: /^RMS-GB-000084-\d{3}$/i,
    },
    regex: {
      description: /Description/i,
      number_of_packages: /Quantity/i,
      total_net_weight_kg: /NetMass/i,
      commodity_code: /CommodityCode/i,
    },
    country_of_origin: /CountryOrigin/i,
    findUnitInHeader: true,
  },
  BUFFALOAD1: {
    establishmentNumber: {
      regex: /RMS-GB-000098-(\d{3})?/i,
    },
    regex: {
      description: descriptionOfGoodsRegex,
      type_of_treatment: /Treatment Type \(Chilled \/Ambient\)/i,
      number_of_packages: noOfPackagesRegex,
      total_net_weight_kg: /Item Net Weight/i,
      commodity_code: commodityCodeRegex,
    },
    country_of_origin: /Country of Origin/i,
    findUnitInHeader: true,
  },
  CDS1: {
    establishmentNumber: {
      regex: /RMS-GB-000252(-\d{3})?/i,
    },
    regex: {
      description: /^Product$/i,
      type_of_treatment: /Treatment/i,
      number_of_packages: /# Packages/i,
      total_net_weight_kg: /NetWeight/i,
      nature_of_products: /NatureOfProduct/i,
    },
    findUnitInHeader: true,
  },
  COOP1: {
    establishmentNumber: {
      regex: /RMS-GB-000009-(\d{3})?/i,
    },
    regex: {
      description: descriptionRegex,
      commodity_code: /Tariff Code EU/i,
      number_of_packages: /Packages/i,
      total_net_weight_kg: /NW total/i,
      header_net_weight_unit: /Net Weight\/Package/i,
    },
    findUnitInHeader: true,
  },
  DAVENPORT1: {
    invalidSheets: [
      "Packing List",
      "Invoice",
      "Lookups",
      "Addresses",
      "Products",
      "Batch Info",
      "Commodity",
      "Meursing",
    ],
    establishmentNumber: {
      regex: /RMS-GB-000323(-\d{3})?/i,
    },
    regex: {
      description: /Description of Goods/i,
      commodity_code: /Commodity Code/i,
      number_of_packages: /No. of Pkgs/i,
      total_net_weight_kg: /Total Net Weight/i,
    },
    country_of_origin: /Country of Origin/i,
    findUnitInHeader: true,
  },
  FOWLERWELCH1: {
    invalidSheets: [
      "Invoice",
      "Lookups",
      "Addresses",
      "Batch Info",
      "Commodity",
      "Meursing",
      "Products",
    ],
    regex: {
      description: /Description of goods/i,
      commodity_code: /Commodity code/i,
      number_of_packages: /No\. of pkgs/i,
      total_net_weight_kg: /(Total Net Weight|Item Net Weight)/i,
      type_of_treatment: /Treatment Type \(Chilled \/Ambient\)/i,
    },
    findUnitInHeader: true,
    country_of_origin: /Country of Origin/i,
    establishmentNumber: {
      regex: /RMS-GB-000216(-\d{3})?/i,
    },
  },
  GIOVANNI1: {
    establishmentNumber: {
      regex: /RMS-GB-000153(-\d{3})?/i,
    },
    regex: {
      description: /DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Quantity/i,
      total_net_weight_kg: netWeightRegex,
    },
    country_of_origin: /Country of Origin/i,
    findUnitInHeader: true,
  },
  GIOVANNI2: {
    establishmentNumber: {
      regex: /RMS-GB-000149(-\d{3})?/i,
    },
    regex: {
      description: /DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Qauntity/i,
      total_net_weight_kg: netWeightRegex,
    },
    country_of_origin: /Country of Origin/i,
    findUnitInHeader: true,
  },
  KEPAK1: {
    establishmentNumber: {
      regex: /RMS-GB-000280(-\d{3})?/i,
    },
    regex: {
      description: /DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Quantity/i,
      total_net_weight_kg: netWeight,
    },
    country_of_origin: /Country of Origin/i,
    findUnitInHeader: true,
  },
  MARS1: {
    establishmentNumber: {
      regex: /RMS-GB-000213(-\d{3})?/i,
    },
    regex: {
      description: /Description/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Case Qty/i,
      total_net_weight_kg: /Weight/i,
    },
    country_of_origin: /Country Code/i,
  },
  NISA1: {
    establishmentNumber: {
      regex: /RMS-GB-000025-(\d{3})?/i,
    },
    regex: {
      description: /PART_NUMBER_DESCRIPTION/i,
      commodity_code: /TARIFF_CODE_EU/i,
      number_of_packages: /PACKAGES/i,
      total_net_weight_kg: /NET_WEIGHT_TOTAL/i,
      nature_of_products: /PRODUCT_TYPE_CATEGORY/i,
    },
  },
  NISA2: {
    establishmentNumber: {
      regex: /RMS-GB-000025-(\d{3})?/i,
    },
    regex: {
      description: /PART NUMBER DESCRIPTION/i,
      commodity_code: /TARIFF CODE EU/i,
      number_of_packages: /PACKAGES/i,
      total_net_weight_kg: /NET WEIGHT TOTAL/i,
      nature_of_products: /PRODUCT TYPE CATEGORY/i,
    },
  },
  NUTRICIA1: {
    establishmentNumber: {
      regex: /RMS-GB-000133(-\d{3})?/i,
    },
    regex: {
      description: /DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Quantity/i,
      total_net_weight_kg: netWeightRegex,
    },
    country_of_origin: /Country of Origin/i,
  },
  SAINSBURYS1: {
    establishmentNumber: {
      regex: /RMS-GB-000094(-\d{3})?/i,
    },
    regex: {
      description: /Product \/ Part Number Description/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Packages/i,
      total_net_weight_kg: /Net\nWeight \/ Package/i,
      nature_of_products: /Product Type \/ Category/i,
      type_of_treatment: /Packaging Type/i,
    },
    findUnitInHeader: true,
  },
  SAVERS1: {
    invalidSheets: ["DC Sheet (with Calcs)", "SPS Codes"],
    establishmentNumber: {
      regex: /RMS-GB-000247-(\d{3})?/i,
    },
    regex: {
      description: /Item Description/i,
      commodity_code: /EU Commodity Code/i,
      number_of_packages: /CASE Quantity/i,
      total_net_weight_kg: netWeight,
    },
    findUnitInHeader: true,
  },
  TESCO1: {
    establishmentNumber: {
      regex: /RMS-GB-000022-(\d{3})?/i,
    },
    regex: {
      description: descriptionRegex,
      commodity_code: /Tariff Code UK/i,
      number_of_packages: /Packages/i,
      total_net_weight_kg: /^Net Weight$/i,
      type_of_treatment: /Treatment Type/i,
      header_net_weight_unit: /Net Weight\/ Package/i,
    },
    findUnitInHeader: true,
  },
  TESCO2: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/i,
    },
    regex: {
      description: descriptionOfGoodsRegex,
      commodity_code: commodityCodeRegex,
      number_of_packages: noOfPackagesRegex,
      total_net_weight_kg: /Total Net Weight/i,
    },
  },
  TESCO3: {
    establishmentNumber: {
      regex: /RMS-GB-000022-(\d{3})?/i,
    },
    regex: {
      description: /Product Description/i,
      commodity_code: /Tariff Code UK/i,
      number_of_packages: /Packages/i,
      total_net_weight_kg: netWeight,
      type_of_treatment: /Treatment Type/i,
    },
    findUnitInHeader: true,
    country_of_origin: /Country of Origin/i,
  },
  TJMORRIS1: {
    establishmentNumber: {
      regex: /RMS-GB-000010-(\d{3})?/i,
    },
  },
  WARRENS1: {
    establishmentNumber: {
      regex: /^RMS-GB-000174-\d{3}$/i,
    },
  },
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
      regex: /^RMS-GB-000008-\d{3}$/i,
    },
    headers: {
      description: "Description of Goods",
      commodity_code: "EU Commodity Code",
      type_of_treatment: "Treatment Type",
      number_of_packages: "Trays/Ctns",
      total_net_weight_kg: "Tot Net Weight (Kg)",
    },
    modelId: "mands1-v3",
  },
  BOOKER1: {
    establishmentNumber: {
      regex: /^RMS-GB-000077/i,
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
      regex: /^RMS-GB-000077/i,
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
  },
  GREGGS1: {
    establishmentNumber: {
      regex: /^RMS-GB-000021-\d{3}$/i,
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
    modelId: "greggs1-v4",
  },
};

module.exports = headers;
