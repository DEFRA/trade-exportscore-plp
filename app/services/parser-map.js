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

module.exports = {
  mapParser,
};
