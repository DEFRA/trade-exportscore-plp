/**
 * Gousto model headers
 *
 * Provides establishment number regexes and header regex mappings
 * for Gousto packing list variants used by matchers.
 */
const goustoHeaders = {
  GOUSTO1: {
    establishmentNumber: {
      regex: /RMS-GB-000483(-\d{3})?/i,
    },
    regex: {
      description: /DESCRIPTION/i,
      type_of_treatment: /TYPE OF TREATMENT/i,
      number_of_packages: /NUMBER OF PACKS/i,
      total_net_weight_kg: /NET WEIGHT.*KG/i,
      nature_of_products: /NATURE/i,
      commodity_code: /COMMODITY CODE/i,
    },
    country_of_origin: /COUNTRY OF ORIGIN/i,
    box_number: /BOX NUMBER/i,
    blanketNirms: {
      regex: /.*/,
      value: "NIRMS",
    },
    findUnitInHeader: true,
    validateCountryOfOrigin: true,
    skipBoxNumberRows: true,
  },
};

module.exports = goustoHeaders;
