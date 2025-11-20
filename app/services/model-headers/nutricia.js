/**
 * Nutricia model headers
 *
 * Provides establishment number regexes and header regex mappings
 * for Nutricia packing list variants used by matchers.
 */
const commodityCodeRegex = /Commodity Code/i;
const netWeight = /Net Weight/i;

const nutriciaHeaders = {
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
};

module.exports = nutriciaHeaders;
