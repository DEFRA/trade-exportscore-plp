const pdfGreggsHeaders = {
  GREGGS1: {
    establishmentNumber: {
      regex: /^(RMS-GB-000021-\d{3})(?: Packing List)?$/i,
      establishmentRegex: /^(RMS-GB-\d{6}-\d{3})(?: Packing List)?$/i,
    },
    headers: {
      commodity_code: "Article",
      description: "Short description",
      number_of_packages: "ORDER QTY",
      total_net_weight_kg: "TOTAL NET WEIGHT kg",
      type_of_treatment: "Treatment Type",
      nature_of_products: "Nature of Product",
      remos_number: "GB Place of Dispatch",
    },
    findUnitInHeader: true,
    modelId: "greggs1-v5",
  },
};

module.exports = { pdfGreggsHeaders };
