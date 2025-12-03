/**
 * ASDA model headers
 *
 * Provides establishment number regexes and header regex mappings
 * for ASDA packing list variants used by matchers.
 */
const netWeight = /Net Weight/i;

const asdaHeaders = {
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
    deprecated: true,
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
};

const csvAsdaHeaders = {
  ASDA4: {
    establishmentNumber: {
      regex: /^RMS-GB-000015-\d{3}$/i,
    },
    regex: {
      commodity_code: /classification_code/i,
      description: /article_description/i,
      nature_of_products: /article_nature/i,
      type_of_treatment: /treatment_type/i,
      number_of_packages: /quantity_ordered/i,
      total_net_weight_kg: /net_weight/i,
    },
    findUnitInHeader: true,
    validateCountryOfOrigin: true,
    nirms: /nirms/i,
    country_of_origin: /country_of_origin/i,
  },
};

module.exports = { asdaHeaders, csvAsdaHeaders };
