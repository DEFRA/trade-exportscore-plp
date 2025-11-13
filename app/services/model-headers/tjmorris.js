const netWeight = /Net Weight/i;

const tjmorrisHeaders = {
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
};

module.exports = tjmorrisHeaders;
