const davenportHeaders = {
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
};

module.exports = davenportHeaders;
