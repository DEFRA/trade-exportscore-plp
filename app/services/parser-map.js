const headers = require("./model-headers");

function findHeaderCols(header, packingListHeader) {
  const headerCols = {};

  for (const value in header) {
    headerCols[value] = Object.keys(packingListHeader).find((key) =>
      packingListHeader[key].startsWith(header[value]),
    );
  }

  return headerCols;
}

function mapParser(packingListJson, headerRow, dataRow, header) {
  const headerCols = findHeaderCols(header, packingListJson[headerRow]);

  const packingListContents = packingListJson.slice(dataRow).map((col) => ({
    description: col[headerCols.description] ?? null,
    nature_of_products: col[headerCols.nature_of_products] ?? null,
    type_of_treatment: col[headerCols.type_of_treatment] ?? null,
    commodity_code: col[headerCols.commodity_code] ?? null,
    number_of_packages: col[headerCols.number_of_packages] ?? null,
    total_net_weight_kg: col[headerCols.total_net_weight_kg] ?? null,
  }));

  return packingListContents;
}

function mapPdfParser(packingListDocument, key) {
  const packingListContents = [];
  for (
    let i = 0;
    i < packingListDocument.fields.PackingListContents.values.length;
    i++
  ) {
    const row = packingListDocument.fields.PackingListContents.values[i].properties;
    const plRow = {
      description: row[headers[key].headers.description]?.value ?? null,
      nature_of_products: row[headers[key].headers.nature_of_products]?.value ?? null,
      type_of_treatment: row[headers[key].headers.type_of_treatment]?.value ?? null,
      commodity_code: row[headers[key].headers.commodity_code]?.value ?? null,
      number_of_packages: (row[headers[key].headers.number_of_packages]?.value * row.Packages?.value) ?? null,
      total_net_weight_kg: row[headers[key].headers.total_net_weight_kg]?.content ?? null,
    };
    packingListContents.push(plRow);
  }

  return packingListContents;
}

module.exports = {
  mapParser,
  mapPdfParser,
};
