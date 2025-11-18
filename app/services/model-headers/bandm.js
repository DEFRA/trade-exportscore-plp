/**
 * BANDM model headers
 *
 * Provides establishment number regexes and header regex mappings
 * for BandM packing list variants used by matchers.
 */
const commodityCodeRegex = /Commodity Code/i;
const netWeight = /Net Weight/i;

const bandmHeaders = {
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
};

module.exports = bandmHeaders;
