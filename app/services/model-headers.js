const descriptionRegex = /Product\/ Part Number description/i;
const descriptionOfGoodsRegex = /Description of goods/i;
const commodityCodeRegex = /Commodity Code/i;
const noOfPackagesRegex = /No. of pkgs/i;
const netWeight = /Net Weight/i;

const headers = {
  ASDA1: {
    deprecated: true,
    establishmentNumber: {
      regex: /^RMS-GB-000015-\d{3}$/i,
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
      regex: /^RMS-GB-000015-\d{3}$/i,
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
  ASDA3: {
    establishmentNumber: {
      regex: /^RMS-GB-000015-\d{3}$/i,
    },
    regex: {
      description: /Description Of All Retail Goods/i,
      nature_of_products: /Nature of Product/i,
      type_of_treatment: /Treatment Type/i,
      number_of_packages: /Number of Packages/i,
      total_net_weight_kg: /Net Weight/i,
    },
    total_net_weight_unit: /kilograms\/grams/i,
    commodity_code: /Commodity Code/i,
    country_of_origin: /Country of Origin/i,
    nirms: /NIRMs\/Non-NIRMs/i,
    validateCountryOfOrigin: true,
  },
  BANDM1: {
    establishmentNumber: {
      regex: /^RMS-GB-000005-\d{3}$/i,
    },
    regex: {
      description: /ITEM DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /TOTAL NUMBER OF CASES/i,
      total_net_weight_kg: netWeight,
    },
    findUnitInHeader: true,
    validateCountryOfOrigin: true,
    country_of_origin: /COUNTRY OF ORIGIN/i,
    blanketNirms: {
      regex: /This consignment contains only NIRMS eligible goods/i,
      value: "NIRMS",
    },
    blanketTreatmentType: {
      regex: /Treatment type: all products are processed/i,
      value: "Processed",
    },
  },
  BOOKER2: {
    establishmentNumber: {
      regex: /RMS-GB-000077-\d{3}/i,
    },
    regex: {
      description: /Description of Goods/i,
      commodity_code: /Commodity Code/i,
      number_of_packages: /No\. of Pkgs/i,
      total_net_weight_kg: /Net Weight/i,
      nature_of_products: /Nature of product/i,
      type_of_treatment: /Treatment Type/i,
    },
    country_of_origin: /Country of Origin/i,
    nirms: /Lane/i,
    validateCountryOfOrigin: true,
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
      regex: /^RMS-GB-000098-\d{3}$/i,
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
      regex: /^RMS-GB-000009-\d{3}$/i,
    },
    regex: {
      description: descriptionRegex,
      commodity_code: /Tariff Code EU/i,
      number_of_packages: /Packages$/i,
      total_net_weight_kg: /NW total/i,
      header_net_weight_unit: /Net Weight\/Package/i,
    },
    country_of_origin: /Country of Origin/i,
    type_of_treatment: /Type of Treatment/i,
    nirms: /^NIRMS$/i,
    findUnitInHeader: true,
    validateCountryOfOrigin: true,
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
      regex: /^RMS-GB-000323-\d{3}$/i,
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
  DAVENPORT2: {
    invalidSheets: ["References", "Lookups", "Meursing"],
    establishmentNumber: {
      regex: /^RMS-GB-000323-\d{3}$/i,
    },
    regex: {
      description: /Description of goods/i,
      commodity_code: /^Commodity Code$/i,
      number_of_packages: /No. of packages/i,
      total_net_weight_kg: /Item Net Weight/i,
      nature_of_products: /Nature of Product/i,
      type_of_treatment: /Type of Treatment/i,
    },
    country_of_origin: /Country of Origin/i,
    nirms: /NIRMS Red\/Green Lane/i,
    findUnitInHeader: true,
    validateCountryOfOrigin: true,
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
      regex: /^RMS-GB-000216-\d{3}$/i,
    },
  },
  GIOVANNI1: {
    establishmentNumber: {
      regex: /^RMS-GB-000153(-\d{3})?$/i,
    },
    regex: {
      description: /DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Quantity/i,
      total_net_weight_kg: netWeight,
    },
    country_of_origin: /Country of Origin/i,
    validateCountryOfOrigin: true,
    findUnitInHeader: true,
    blanketNirms: {
      regex:
        /The exporter of the products covered by this document \(NIRMS RMS-GB-000153(-\d{3})?\)\s*declares that these products are intend for the Green lane and will remain\s*in Northern Ireland/i,
      value: "NIRMS",
    },
    blanketTreatmentType: {
      regex: /Treatment/i,
    },
  },
  GIOVANNI2: {
    establishmentNumber: {
      regex: /RMS-GB-000149(-\d{3})?/i,
    },
    regex: {
      description: /DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Qauntity/i,
      total_net_weight_kg: netWeight,
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
    validateCountryOfOrigin: true,
    blanketNirms: {
      regex:
        /The exporter of the products covered by this document \(NIRMS RMS-GB-000280\)\s*declares that these products are intend for the Green lane and will remain\s+in Northern Ireland./i,
      value: "NIRMS",
    },
    singleValueTypeOfTreatment: { col: "H", row: 16 },
  },
  MARS1: {
    establishmentNumber: {
      regex: /^RMS-GB-000213-\d{3}$/i,
    },
    regex: {
      description: /Description/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Case Qty/i,
      total_net_weight_kg: netWeight,
    },
    country_of_origin: /Country Code/i,
    type_of_treatment: /Type of Treatment/i,
    nirms: /SPS/i,
    findUnitInHeader: true,
    validateCountryOfOrigin: true,
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
      header_net_weight_unit: /NET_WEIGHT_PACKAGE/i,
    },
    findUnitInHeader: true,
    country_of_origin: /COUNTRY_OF_ORIGIN/i,
    type_of_treatment: /TYPE_OF_TREATMENT/i,
    nirms: /NIRMS/i,
    validateCountryOfOrigin: true,
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
      header_net_weight_unit: /NET WEIGHT PACKAGE/i,
    },
    findUnitInHeader: true,
  },
  NUTRICIA1: {
    establishmentNumber: {
      regex: /^RMS-GB-000133(-\d{3})?$/i,
    },
    regex: {
      description: /DESCRIPTION/i,
      commodity_code: commodityCodeRegex,
      number_of_packages: /Quantity/i,
      total_net_weight_kg: netWeight,
    },
    findUnitInHeader: true,
    country_of_origin: /Country of Origin/i,
  },
  NUTRICIA2: {
    establishmentNumber: {
      regex: /^RMS-GB-000133(-\d{3})?$/i,
    },
    regex: {
      description: /Material description/i,
      commodity_code: /Commodity code/i,
      number_of_packages: /Order qty/i,
      total_net_weight_kg: /Order net weight/i,
    },
    findUnitInHeader: true,
    country_of_origin: /coo/i,
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
      type_of_treatment: /Type of treatment/i,
    },
    country_of_origin: /NIRMS Country of Origin/i,
    nirms: /NIRMS or non-NIRMS/i,
    validateCountryOfOrigin: true,
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
    country_of_origin: /Country of Origin/i,
    type_of_treatment: /Type of Treatment/i,
    nirms: /NIRMS \/ SPS Item/i,
    validateCountryOfOrigin: true,
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
    findUnitInHeader: true,
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
    nirms: /NIRMS \/ NON NIRMS/i,
    validateCountryOfOrigin: true,
  },
  TJMORRIS1: {
    establishmentNumber: {
      regex: /RMS-GB-000010-(\d{3})?/i,
    },
    findUnitInHeader: true,
  },
  TJMORRIS2: {
    establishmentNumber: {
      regex: /^RMS-GB-000010-\d{3}$/i,
    },
    regex: {
      description: /Description/i,
      commodity_code: /Tariff\/Commodity/i,
      number_of_packages: /Number of packages/i,
      total_net_weight_kg: netWeight,
      type_of_treatment: /Treatment Type/i,
      nature_of_products: /Nature of Products/i,
    },
    findUnitInHeader: true,
    country_of_origin: /Country of Origin/i,
    nirms: /^NIRMS Eligible$/i,
    validateCountryOfOrigin: true,
  },
  WARRENS1: {
    establishmentNumber: {
      regex: /^RMS-GB-000174-\d{3}$/i,
    },
  },
};

module.exports = headers;
