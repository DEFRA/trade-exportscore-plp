const csvIcelandHeaders = {
  ICELAND2: {
    establishmentNumber: {
      regex: /RMS-GB-000040-\d{3}$/i,
    },
    regex: {
      commodity_code: /Tariff Code EU/i,
      description: /Product\/Part Number description/i,
      type_of_treatment: /Treatment Type/i,
      number_of_packages: /Packages/i,
      total_net_weight_kg: /Net Weight\/Package/i,
      nature_of_products: /Nature/i,
    },
    findUnitInHeader: true,
    validateCountryOfOrigin: true,
    nirms: /NIRMS/i,
    country_of_origin: /Country of Origin Code/i,
  },
};

const pdfIcelandHeaders = {
  ICELAND1: {
    establishmentNumber: {
      regex: /RMS-GB-000040/i,
      value: "RMS-GB-000040",
      establishmentRegex: /RMS-GB-\d{6}-(?:\s)?\d{3}/gi,
    },
    headers: {
      description: "Part Description",
      commodity_code: "Tariff Code",
      number_of_packages: "Unit Qty",
      total_net_weight_kg: "Net Weight (KG)",
    },
    findUnitInHeader: true,
    modelId: "iceland1-v4",
  },
};

module.exports = { csvIcelandHeaders, pdfIcelandHeaders };
