const descriptionRegex = /Product\/ Part Number description/i;
const descriptionOfGoodsRegex = /Description of goods/i;
const commodityCodeRegex = /Commodity Code/i;
const noOfPackagesRegex = /No. of pkgs/i;
const netWeightRegex = /Net Weight \(KG\)/i;

const booker1 = {
  establishmentNumber: {
    regex: /^RMS-GB-000077/i,
  },
  headers: {
    description: {
      x: /Description/i,
      regex: /Description/i,
      headerTextAlignment: "CL",
    },
    commodity_code: {
      x: /Commodity Code/i,
      regex: /Commodity Code/i,
      headerTextAlignment: "LL",
    },
    number_of_packages: {
      x: /Quantity/i,
      regex: /Unit Quantity/i,
      headerTextAlignment: "LL",
    },
    total_net_weight_kg: {
      x: /Net/i,
      regex: /Net Weight \(Kilos\)/i,
      headerTextAlignment: "LL",
    },
  },
  totals: /^0 Boxes/i,
  minHeadersY: /Net/i,
  maxHeadersY: /(Kilos)/i,
};

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
      total_net_weight_kg: /NET Weight/i,
    },
  },
  BANDM1: {
    establishmentNumber: {
      regex: /RMS-GB-000005-(\d{3})?/i,
    },
    regex: [
      /ITEM DESCRIPTION/i,
      commodityCodeRegex,
      /TOTAL NUMBER OF CASES/i,
      /NET WEIGHT/i,
    ],
  },
  BOOTS1: {
    establishmentNumber: {
      regex: /^RMS-GB-000084-\d{3}$/i,
    },
    regex: {
      description: /Description/i,
      number_of_packages: /Quantity/i,
      total_net_weight_kg: /NetMassKG/i,
      commodity_code: /CommodityCode/i,
    },
    country_of_origin: /CountryOrigin/i,
  },
  BUFFALOAD1: {
    establishmentNumber: {
      regex: /RMS-GB-000098-(\d{3})?/i,
    },
    regex: {
      description: descriptionOfGoodsRegex,
      type_of_treatment: /Treatment Type \(Chilled \/Ambient\)/i,
      number_of_packages: noOfPackagesRegex,
      total_net_weight_kg: /Item Net Weight \(kgs\)/i,
      commodity_code: commodityCodeRegex,
    },
    country_of_origin: /Country of Origin/i,
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
    },
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
      total_net_weight_kg:
        /(Total Net Weight|Item Net Weight)(\s+\d+(\.\d+)?\s*kgs)?/i,
      type_of_treatment: /Treatment Type \(Chilled \/Ambient\)/i,
    },
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
  },
  KEPAK1: {
    establishmentNumber: {
      regex: /RMS-GB-000280(-\d{3})?/i,
    },
    regex: {
      description: /DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Quantity/i,
      total_net_weight_kg: netWeightRegex,
    },
    country_of_origin: /Country of Origin/i,
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
      total_net_weight_kg: /Net\nWeight \/ Package KG/i,
      nature_of_products: /Product Type \/ Category/i,
      type_of_treatment: /Packaging Type/i,
    },
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
      total_net_weight_kg: /Net Weight \(KGs\)/i,
    },
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
    },
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
      total_net_weight_kg: /^Net Weight \(KG\)$/i,
      type_of_treatment: /Treatment Type/i,
    },
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
    modelId: "iceland1-v3",
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
  BOOKER1: booker1,
  BOOKER1L: {
    ...booker1,
    headers: {
      ...booker1.headers,
      type_of_treatment: {
        x: /Treatment Type/i,
        regex: /Treatment Type/i,
        headerTextAlignment: "LL",
      },
    },
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
    modelId: "greggs1-v2",
  },
};

module.exports = headers;
