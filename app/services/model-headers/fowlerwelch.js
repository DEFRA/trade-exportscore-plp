const fowlerWelchHeaders = {
  FOWLERWELCH1: {
    invalidSheets: [
      "Invoice",
      "Lookups",
      "Addresses",
      "Batch Info",
      "Commodity",
      "Meursing",
      "Products",
    ],
    regex: {
      description: /Description of goods/i,
      commodity_code: /Commodity code/i,
      number_of_packages: /No\. of pkgs/i,
      total_net_weight_kg: /(Total Net Weight|Item Net Weight)/i,
      type_of_treatment: /Treatment Type \(Chilled \/Ambient\)/i,
    },
    findUnitInHeader: true,
    country_of_origin: /Country of Origin/i,
    establishmentNumber: {
      regex: /^RMS-GB-000216-\d{3}$/i,
    },
  },
  FOWLERWELCH2: {
    establishmentNumber: {
      regex: /^RMS-GB-000216-\d{3}$/i,
    },
  },
};

module.exports = fowlerWelchHeaders;
