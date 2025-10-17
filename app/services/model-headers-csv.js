const headers = {
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

module.exports = headers;
