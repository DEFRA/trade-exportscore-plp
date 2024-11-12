const descriptionRegex = /Product\/ Part Number description/;
const descriptionOfGoodsRegex = /Description of goods/;
const commodityCode = "Commodity Code";
const commodityCodeRegex = /Commodity Code/;
const commodityCodeLowercaseRegex = /Commodity code/;
const noOfPackagesRegex = /No. of pkgs/;
const netWeightRegex = /Net Weight \(KG\)/;

const headers = {
  ASDA1: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/,
    },
    regex: {
      description: /\[Description Of All Retail Goods\]/,
      nature_of_products: /\[Nature Of Product\]/,
      type_of_treatment: /\[Treatment Type\]/,
      number_of_packages: /\[Number of Packages\]/,
      total_net_weight_kg: /\[Net Weight\]/,
    },
  },
  ASDA2: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/,
    },
    regex: {
      description: /\[Description Of All Retail Go/,
      nature_of_products: /\[Nature Of Product\]/,
      type_of_treatment: /\[Treatment Ty/,
      number_of_packages: /Cases/,
      total_net_weight_kg: /NET Weight/,
    },
  },
  BANDM1: {
    establishmentNumber: {
      regex: /RMS-GB-000005-(\d{3})?/,
    },
    headers: {
      description: "ITEM DESCRIPTION",
      commodity_code: commodityCode,
      number_of_packages: "TOTAL NUMBER OF CASES",
      total_net_weight_kg: "NET WEIGHT",
    },
    regex: [
      /ITEM DESCRIPTION/,
      commodityCodeRegex,
      /TOTAL NUMBER OF CASES/,
      /NET WEIGHT/,
    ],
  },
  BUFFALOAD1: {
    establishmentNumber: {
      regex: /RMS-GB-000098-(\d{3})?/,
    },
    regex: {
      description: descriptionOfGoodsRegex,
      type_of_treatment: /Treatment Type \(Chilled \/Ambient\)/,
      number_of_packages: noOfPackagesRegex,
      total_net_weight_kg: /Item Net Weight \(kgs\)/,
      commodity_code: commodityCodeLowercaseRegex,
    },
  },
  CDS1: {
    establishmentNumber: {
      regex: /RMS-GB-000252(-\d{3})?/,
    },
    regex: {
      description: /^Product$/,
      type_of_treatment: /Treatment/,
      number_of_packages: /# Packages/,
      total_net_weight_kg: /NetWeight/,
      nature_of_products: /NatureOfProduct/,
    },
  },
  COOP1: {
    establishmentNumber: {
      regex: /RMS-GB-000009-(\d{3})?/,
    },
    regex: {
      description: descriptionRegex,
      commodity_code: /Tariff Code EU/,
      number_of_packages: /Packages/,
      total_net_weight_kg: /NW total/,
    },
  },
  DAVENPORT1: {
    establishmentNumber: {
      regex: /RMS-GB-000323(-\d{3})?/,
    },
    regex: {
      description: /Description of Goods/,
      commodity_code: /Commodity Code/,
      number_of_packages: /No. of Pkgs/,
      total_net_weight_kg: /Total Net Weight/,
    },
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
      description: /Description of goods/,
      commodity_code: /Commodity code/,
      number_of_packages: /No\. of pkgs/i,
      total_net_weight_kg:
        /(Total Net Weight|Item Net Weight)(\s+\d+(\.\d+)?\s*kgs)?/,
      type_of_treatment: /Treatment Type \(Chilled \/Ambient\)/,
    },
    establishmentNumber: {
      regex: /RMS-GB-000216(-\d{3})?/,
    },
  },
  GIOVANNI1: {
    establishmentNumber: {
      regex: /RMS-GB-000153(-\d{3})?/,
    },
    regex: {
      description: /DESCRIPTION/,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Quantity/,
      total_net_weight_kg: netWeightRegex,
    },
  },
  KEPAK1: {
    establishmentNumber: {
      regex: /RMS-GB-000280(-\d{3})?/,
    },
    regex: {
      description: /DESCRIPTION/,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Quantity/,
      total_net_weight_kg: netWeightRegex,
    },
  },
  MARS1: {
    establishmentNumber: {
      regex: /RMS-GB-000213(-\d{3})?/,
    },
    regex: {
      description: /Description/,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Case Qty/,
      total_net_weight_kg: /Weight/,
    },
  },
  NISA1: {
    establishmentNumber: {
      regex: /RMS-GB-000025-(\d{3})?/,
    },
    regex: {
      description: /PART_NUMBER_DESCRIPTION/,
      commodity_code: /TARIFF_CODE_EU/,
      number_of_packages: /PACKAGES/,
      total_net_weight_kg: /NET_WEIGHT_TOTAL/,
      nature_of_products: /PRODUCT_TYPE_CATEGORY/,
    },
  },
  NISA2: {
    establishmentNumber: {
      regex: /RMS-GB-000025-(\d{3})?/,
    },
    regex: {
      description: /PART NUMBER DESCRIPTION/,
      commodity_code: /TARIFF CODE EU/,
      number_of_packages: /PACKAGES/,
      total_net_weight_kg: /NET WEIGHT TOTAL/,
      nature_of_products: /PRODUCT TYPE CATEGORY/,
    },
  },
  NUTRICIA1: {
    establishmentNumber: {
      regex: /RMS-GB-000133(-\d{3})?/,
    },
    regex: {
      description: /DESCRIPTION/,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Quantity/,
      total_net_weight_kg: netWeightRegex,
    },
  },
  SAINSBURYS1: {
    establishmentNumber: {
      regex: /RMS-GB-000094(-\d{3})?/,
    },
    regex: {
      description: /Product \/ Part Number Description/,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Packages/,
      total_net_weight_kg: /Net\nWeight \/ Package KG/,
      nature_of_products: /Product Type \/ Category/,
      type_of_treatment: /Packaging Type/,
    },
  },
  TESCO1: {
    establishmentNumber: {
      regex: /RMS-GB-000022-(\d{3})?/,
    },
    regex: {
      description: descriptionRegex,
      commodity_code: /Tariff Code UK/,
      number_of_packages: /Packages/,
      total_net_weight_kg: /^Net Weight$/,
      type_of_treatment: /Treatment Type/,
    },
  },
  TESCO2: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/,
    },
    regex: {
      description: descriptionOfGoodsRegex,
      commodity_code: commodityCodeLowercaseRegex,
      number_of_packages: noOfPackagesRegex,
      total_net_weight_kg: /Total Net Weight/,
    },
  },
  TJMORRIS1: {
    establishmentNumber: {
      regex: /RMS-GB-000010-(\d{3})?/,
    },
  },
  WARRENS1: {
    establishmentNumber: {
      regex: /^RMS-GB-000174-\d{3}$/,
    },
  },
  ICELAND1: {
    establishmentNumber: {
      regex: /^KingdomRMS_ESTABLISHMENT_NORMS-GB-000040-/,
      value: "RMS-GB-000040",
    },
    headers: {
      description: "Part Description",
      commodity_code: "Tariff Code",
      number_of_packages: "Unit Qty",
      total_net_weight_kg: "Net Weight (KG)",
    },
    modelId: "iceland-requireddataonly-stringsintsandnumbers",
  },
  MANDS1: {
    establishmentNumber: {
      regex: /^RMS-GB-000008-\d{3}$/,
    },
    headers: {
      description: "Description of Goods",
      commodity_code: "EU Commodity Code",
      type_of_treatment: "Treatment Type",
      number_of_packages: "Trays/Ctns",
      total_net_weight_kg: "Tot Net Weight (Kg)",
    },
    modelId: "mands-v1",
  },
};

module.exports = headers;
