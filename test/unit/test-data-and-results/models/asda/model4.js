const validModel = [
  ["RMS-GB-000015-001", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    "classification_code",
    "article_description",
    "article_nature",
    "treatment_type",
    "quantity_ordered",
    "net_weight_kg",
    "country_of_origin",
    "nirms",
  ],
  [
    "1234567890",
    "Test Product 1",
    "Fresh",
    "Chilled",
    "10",
    "5.5",
    "GB",
    "NIRMS",
  ],
  [
    "9876543210",
    "Test Product 2",
    "Processed",
    "Ambient",
    "20",
    "12.3",
    "FR",
    "NON-NIRMS",
  ],
];

const emptyModel = [];

const wrongEstablishmentNumber = [
  ["RMS-GB-999999-001", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    "classification_code",
    "article_description",
    "article_nature",
    "treatment_type",
    "quantity_ordered",
    "net_weight_kg",
    "country_of_origin",
    "nirms",
  ],
  [
    "1234567890",
    "Test Product 1",
    "Fresh",
    "Chilled",
    "10",
    "5.5",
    "GB",
    "NIRMS",
  ],
];

const wrongHeaders = [
  ["RMS-GB-000015-001", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    "wrong_code",
    "wrong_description",
    "wrong_nature",
    "wrong_treatment",
    "wrong_quantity",
    "wrong_weight",
    "wrong_country",
    "wrong_nirms",
  ],
  [
    "1234567890",
    "Test Product 1",
    "Fresh",
    "Chilled",
    "10",
    "5.5",
    "GB",
    "NIRMS",
  ],
];

const invalidModel_MissingColumnCells = [
  ["RMS-GB-000015-001", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    "classification_code",
    "article_description",
    "article_nature",
    "treatment_type",
    "quantity_ordered",
    "net_weight_kg",
    "country_of_origin",
    "nirms",
  ],
  ["", "Test Product 1", "Fresh", "Chilled", "10", "5.5", "GB", "NIRMS"],
  ["9876543210", "", "Processed", "Ambient", "20", "12.3", "FR", "NON-NIRMS"],
];

const invalidModel_MultipleRms = [
  ["RMS-GB-000015-001", "", "", "", "", "", "", ""],
  ["RMS-GB-000015-002", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    "classification_code",
    "article_description",
    "article_nature",
    "treatment_type",
    "quantity_ordered",
    "net_weight_kg",
    "country_of_origin",
    "nirms",
  ],
  [
    "1234567890",
    "Test Product 1",
    "Fresh",
    "Chilled",
    "10",
    "5.5",
    "GB",
    "NIRMS",
  ],
];

const invalidModel = [
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    "classification_code",
    "article_description",
    "article_nature",
    "treatment_type",
    "quantity_ordered",
    "net_weight_kg",
    "country_of_origin",
    "nirms",
  ],
  [
    "1234567890",
    "Test Product 1",
    "Fresh",
    "Chilled",
    "10",
    "5.5",
    "GB",
    "NIRMS",
  ],
];

module.exports = {
  validModel,
  emptyModel,
  wrongEstablishmentNumber,
  wrongHeaders,
  invalidModel_MissingColumnCells,
  invalidModel_MultipleRms,
  invalidModel,
};
