/**
 * M&S model headers
 *
 * Provides establishment number regexes and header regex mappings
 * for M&S packing list variants used by matchers.
 */
const pdfMandsHeaders = {
  MANDS1: {
    establishmentNumber: {
      regex: /^(?:Depot Approval Number:\s)?(RMS-GB-000008-\d{3})$/i,
      establishmentRegex:
        /^(?:Depot Approval Number:\s)?(RMS-GB-\d{6}-\d{3})$/i,
    },
    headers: {
      description: "Description of Goods",
      commodity_code: "EU Commodity Code",
      type_of_treatment: "Treatment Type",
      number_of_packages: "Trays/Ctns",
      total_net_weight_kg: "Tot Net Weight (Kg)",
      country_of_origin: "CountryOfOrigin",
      nirms: "NIRMS",
    },
    validateCountryOfOrigin: true,
    findUnitInHeader: true,
    modelId: "mands1-v5",
  },
};

module.exports = { pdfMandsHeaders };
