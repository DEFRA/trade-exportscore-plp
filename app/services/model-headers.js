const description = "Product/ Part Number description";
const descriptionRegex = /Product\/ Part Number description/;
const descriptionOfGoods = "Description of goods";
const descriptionOfGoodsRegex = /Description of goods/;
const commodityCode = "Commodity Code";
const commodityCodeRegex = /Commodity Code/;
const commodityCodeLowercase = "Commodity code";
const commodityCodeLowercaseRegex = /Commodity code/;
const noOfPackages = "No. of pkgs";
const noOfPackagesRegex = /No. of pkgs/;
const netWeight = "Net Weight (KG)";
const netWeightRegex = /Net Weight \(KG\)/;

const headers = {
  ASDA1: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/,
    },
    headers: {
      description: "[Description Of All Retail Goods]",
      nature_of_products: "[Nature Of Product]",
      type_of_treatment: "[Treatment Type]",
      number_of_packages: "[Number of Packages]",
      total_net_weight_kg: "[Net Weight]",
    },
    regex: [
      /\[Description Of All Retail Goods\]/,
      /\[Nature Of Product\]/,
      /\[Treatment Type\]/,
      /\[Number of Packages\]/,
      /\[Net Weight\]/,
    ],
  },
  ASDA2: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/,
    },
    headers: {
      description: "[Description Of All Retail Go",
      nature_of_products: "[Nature Of Product]",
      type_of_treatment: "[Treatment Ty",
      number_of_packages: "Cases",
      total_net_weight_kg: "NET Weight",
    },
    regex: [
      /\[Description Of All Retail Go/,
      /\[Nature Of Product\]/,
      /\[Treatment Ty/,
      /Cases/,
      /NET Weight/,
    ],
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
    headers: {
      description: descriptionOfGoods,
      type_of_treatment: "Treatment Type (Chilled /Ambient)",
      number_of_packages: noOfPackages,
      total_net_weight_kg: "Item Net Weight (kgs)",
      commodity_code: commodityCodeLowercase,
    },
    regex: [
      descriptionOfGoodsRegex,
      /Treatment Type \(Chilled \/Ambient\)/,
      noOfPackagesRegex,
      /Item Net Weight \(kgs\)/,
      commodityCodeLowercaseRegex,
    ],
  },
  CDS1: {
    establishmentNumber: {
      regex: /RMS-GB-000252(-\d{3})?/,
    },
    headers: {
      description: "Product",
      type_of_treatment: "Treatment",
      number_of_packages: "# Packages",
      total_net_weight_kg: "NetWeight",
      nature_of_products: "NatureOfProduct",
    },
    regex: [
      /^Product$/,
      /Treatment/,
      /# Packages/,
      /NetWeight/,
      /NatureOfProduct/,
    ],
  },
  COOP1: {
    establishmentNumber: {
      regex: /RMS-GB-000009-(\d{3})?/,
    },
    headers: {
      description: description,
      commodity_code: "Tariff Code EU",
      number_of_packages: "Packages",
      total_net_weight_kg: "NW total",
    },
    regex: [descriptionRegex, /Tariff Code EU/, /Packages/, /NW total/],
  },
  DAVENPORT1: {
    establishmentNumber: {
      regex: /RMS-GB-000323(-\d{3})?/,
    },
    headers: {
      description: "Description of Goods",
      commodity_code: commodityCode,
      number_of_packages: "No. of Pkgs",
      total_net_weight_kg: "Total Net Weight",
    },
    regex: [
      /Description of Goods/,
      /Commodity Code/,
      /No. of Pkgs/,
      /Total Net Weight/,
    ],
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
    headers: {
      description: descriptionOfGoods,
      commodity_code: commodityCodeLowercase,
      number_of_packages: noOfPackages,
      total_net_weight_kg: "Item Net Weight (kgs)",
      type_of_treatment: "Treatment Type (Chilled /Ambient)",
    },
    establishmentNumber: {
      regex: /RMS-GB-000216(-\d{3})?/,
    },
  },
  GIOVANNI1: {
    establishmentNumber: {
      regex: /RMS-GB-000153(-\d{3})?/,
    },
    headers: {
      description: "DESCRIPTION",
      commodity_code: commodityCode,
      number_of_packages: "Quantity",
      total_net_weight_kg: netWeight,
    },
    regex: [/DESCRIPTION/, commodityCodeRegex, /Quantity/, netWeightRegex],
  },
  KEPAK1: {
    establishmentNumber: {
      regex: /RMS-GB-000280(-\d{3})?/,
    },
    headers: {
      description: "DESCRIPTION",
      commodity_code: commodityCode,
      number_of_packages: "Quantity",
      total_net_weight_kg: netWeight,
    },
    regex: [/DESCRIPTION/, commodityCodeRegex, /Quantity/, netWeightRegex],
  },
  NISA1: {
    establishmentNumber: {
      regex: /RMS-GB-000025-(\d{3})?/,
    },
    headers: {
      description: "PART_NUMBER_DESCRIPTION",
      commodity_code: "TARIFF_CODE_EU",
      number_of_packages: "PACKAGES",
      total_net_weight_kg: "NET_WEIGHT_TOTAL",
      nature_of_products: "PRODUCT_TYPE_CATEGORY",
    },
    regex: [
      /PART_NUMBER_DESCRIPTION/,
      /TARIFF_CODE_EU/,
      /PACKAGES/,
      /NET_WEIGHT_TOTAL/,
      /PRODUCT_TYPE_CATEGORY/,
    ],
  },
  NISA2: {
    establishmentNumber: {
      regex: /RMS-GB-000025-(\d{3})?/,
    },
    headers: {
      description: "PART NUMBER DESCRIPTION",
      commodity_code: "TARIFF CODE EU",
      number_of_packages: "PACKAGES",
      total_net_weight_kg: "NET WEIGHT TOTAL",
      nature_of_products: "PRODUCT TYPE CATEGORY",
    },
    regex: [
      /PART NUMBER DESCRIPTION/,
      /TARIFF CODE EU/,
      /PACKAGES/,
      /NET WEIGHT TOTAL/,
      /PRODUCT TYPE CATEGORY/,
    ],
  },
  NUTRICIA1: {
    establishmentNumber: {
      regex: /RMS-GB-000133(-\d{3})?/,
    },
    headers: {
      description: "DESCRIPTION",
      commodity_code: commodityCode,
      number_of_packages: "Quantity",
      total_net_weight_kg: netWeight,
    },
    regex: [/DESCRIPTION/, commodityCodeRegex, /Quantity/, netWeightRegex],
  },
  SAINSBURYS1: {
    establishmentNumber: {
      regex: /RMS-GB-000094(-\d{3})?/,
    },
    headers: {
      description: "Product / Part Number Description",
      commodity_code: commodityCode,
      number_of_packages: "Packages",
      total_net_weight_kg: "Net\nWeight / Package KG",
      nature_of_products: "Product Type / Category",
      type_of_treatment: "Packaging Type",
    },
    regex: [
      /Product \/ Part Number Description/,
      commodityCodeRegex,
      /Packages/,
      /Net\nWeight \/ Package KG/,
      /Product Type \/ Category/,
      /Packaging Type/,
    ],
  },
  TESCO1: {
    establishmentNumber: {
      regex: /RMS-GB-000022-(\d{3})?/,
    },
    headers: {
      description: description,
      commodity_code: "Tariff Code UK",
      number_of_packages: "Packages",
      total_net_weight_kg: "Net Weight",
      type_of_treatment: "Treatment Type",
    },
    regex: [
      descriptionRegex,
      /Tariff Code UK/,
      /Packages/,
      /Net Weight/,
      /Treatment Type/,
    ],
  },
  TESCO2: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/,
    },
    headers: {
      description: descriptionOfGoods,
      commodity_code: commodityCodeLowercase,
      number_of_packages: noOfPackages,
      total_net_weight_kg: "Total Net Weight",
    },
    regex: [
      descriptionOfGoodsRegex,
      commodityCodeLowercaseRegex,
      noOfPackagesRegex,
      /Total Net Weight/,
    ],
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
};

module.exports = headers;
