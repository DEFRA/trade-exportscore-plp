const commodityCodeRegex = /Commodity Code/i;
const netWeight = /Net Weight/i;

const marsHeaders = {
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
};

module.exports = marsHeaders;
