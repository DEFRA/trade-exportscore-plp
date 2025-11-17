/**
 * Booker model headers
 *
 * Provides establishment number regexes and header regex mappings
 * for Booker packing list variants used by matchers.
 */
const netWeight = /Net Weight/i;

const bookerHeaders = {
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
};

const pdfBookerHeaders = {
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
};

module.exports = { bookerHeaders, pdfBookerHeaders };
