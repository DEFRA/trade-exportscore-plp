const headers = require("./model-headers");

function findHeaderCols(regexHeader, packingListHeader) {
  const headerCols = {};
  for (const value in regexHeader) {
    headerCols[value] = Object.keys(packingListHeader).find((key) => {
      return regexHeader[value].test(packingListHeader[key]);
    });
  }
  return headerCols;
}

function mapParser(packingListJson, headerRow, dataRow, header, sheetName = null) {
  const headerCols = findHeaderCols(header, packingListJson[headerRow]);
  const packingListContents = packingListJson.slice(dataRow).map((col, rowPos) => ({
    description: col[headerCols.description] ?? null,
    nature_of_products: col[headerCols.nature_of_products] ?? null,
    type_of_treatment: col[headerCols.type_of_treatment] ?? null,
    commodity_code: col[headerCols.commodity_code] ?? null,
    number_of_packages: col[headerCols.number_of_packages] ?? null,
    total_net_weight_kg: col[headerCols.total_net_weight_kg] ?? null,
    row_location: {
      rowNumber: dataRow + rowPos + 1,
      sheetName,
    },
  }));
  return packingListContents;
}

function mapPdfParser(packingListDocument, key) {
  const packingListContents = [];

  if (packingListDocument.fields.PackingListContents.values) {
    let currentItemNumber = 0;
    for (const value of packingListDocument.fields.PackingListContents.values) {
       currentItemNumber += 1;

      const row = value.properties;
      const plRow = {
        description: row[headers[key].headers.description]?.value ?? null,
        nature_of_products:
          row[headers[key].headers.nature_of_products]?.value ?? null,
        type_of_treatment:
          row[headers[key].headers.type_of_treatment]?.value ?? null,
        commodity_code: row[headers[key].headers.commodity_code]?.value ?? null,
        number_of_packages:
          row[headers[key].headers.number_of_packages]?.value ?? null,
        total_net_weight_kg:
          parseFloat(row[headers[key].headers.total_net_weight_kg]?.content) ??
          null,
        row_location: {
          rowNumber: currentItemNumber,
        }
      };
      
      packingListContents.push(plRow);
    }
  }

  return packingListContents;
}

module.exports = {
  mapParser,
  mapPdfParser,
};
