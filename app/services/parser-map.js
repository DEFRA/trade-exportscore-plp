function findHeaderCols(header, packingListHeader) {
  let headerCols = {};

  for (const value in header) {
    headerCols[value] = Object.keys(packingListHeader).find((key) =>
      packingListHeader[key].startsWith(header[value]),
    );
  }

  return headerCols;
}

function mapParser(packingListJson, headerRow, dataRow, header) {
  console.log(packingListJson[headerRow]);
  console.log(header);
  const headerCols = findHeaderCols(header, packingListJson[headerRow]);
  console.log(headerCols);
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
