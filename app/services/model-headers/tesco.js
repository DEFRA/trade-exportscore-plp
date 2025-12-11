/**
 * Tesco model headers
 *
 * Provides establishment number regexes and header regex mappings
 * for Tesco packing list variants used by matchers.
 */
const descriptionRegex = /Product\/ Part Number description/i;
const descriptionOfGoodsRegex = /Description of goods/i;
const commodityCodeRegex = /Commodity Code/i;
const noOfPackagesRegex = /No. of pkgs/i;
const netWeight = /Net Weight/i;

const tescoHeaders = {
  TESCO2: {
    establishmentNumber: {
      regex: /RMS-GB-000015-(\d{3})?/i,
    },
    regex: {
      description: descriptionOfGoodsRegex,
      commodity_code: /Commodity code/i,
      number_of_packages: noOfPackagesRegex,
      total_net_weight_kg: /Total Net Weight/i,
    },
    findUnitInHeader: true,
    nature_of_products: /Nature of Product/i,
    type_of_treatment: /Type of Treatment/i,
    country_of_origin: /Country of Origin/i,
    nirms: /NIRMS \/ Non NIRMS/i,
    validateCountryOfOrigin: true,
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
};

module.exports = tescoHeaders;
