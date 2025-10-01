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
      total_net_weight_kg: /net_weight_/i,
    },
    findUnitInHeader: true,
    validateCountryOfOrigin: true,
    nirms: /nirms/i,
    country_of_origin: /country_of_origin/i,
  },
};
