const headers = require("./model-headers");
const pdfHelper = require("../utilities/pdf-helper");

function findHeaderCols(regexHeader, packingListHeader) {
  const headerCols = {};
  for (const value in regexHeader) {
    headerCols[value] = Object.keys(packingListHeader).find((key) => {
      return regexHeader[value].test(packingListHeader[key]);
    });
  }
  return headerCols;
}

function mapParser(
  packingListJson,
  headerRow,
  dataRow,
  header,
  sheetName = null,
) {
  const headerCols = findHeaderCols(header, packingListJson[headerRow]);
  const packingListContents = packingListJson
    .slice(dataRow)
    .map((col, rowPos) => ({
      description: col[headerCols.description] ?? null,
      nature_of_products: col[headerCols.nature_of_products] ?? null,
      type_of_treatment: col[headerCols.type_of_treatment] ?? null,
      commodity_code: col[headerCols.commodity_code] ?? null,
      number_of_packages: col[headerCols.number_of_packages] ?? null,
      total_net_weight_kg: col[headerCols.total_net_weight_kg] ?? null,
      country_of_origin: col[headerCols.country_of_origin] ?? null,
      row_location: {
        rowNumber: dataRow + rowPos + 1,
        sheetName,
      },
    }));
  return packingListContents;
}

function mapPdfParser(packingListDocument, key) {
  const packingListContents = [];

  if (!packingListDocument.fields.PackingListContents.values) {
    return []
  }

  let currentItemNumber = 0;
  let lastPageNumber = 1;
  for (const value of packingListDocument.fields.PackingListContents.values) {
    const row = value.properties;
    const currentPageNumber =
      row[headers[key].headers.description]?.boundingRegions?.[0]
        ?.pageNumber ?? lastPageNumber;
    if (lastPageNumber !== currentPageNumber) {
      lastPageNumber = currentPageNumber;
      currentItemNumber = 0;
    }
    currentItemNumber += 1;

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
        pageNumber: currentPageNumber,
      },
    };

    packingListContents.push(plRow);
  }

  return packingListContents;
}

function mapPdfNonAiParser(packingListJson, model) {
  const xs = pdfHelper.getXsForRows(packingListJson.content, model);
  const ys = pdfHelper.getYsForRows(packingListJson.content, model);
  const packingListContents = [];

  ys.forEach((y, row) => {
    const plRow = {};
    Object.keys(xs).forEach((key) => {
      plRow[key] =
        packingListJson.content.filter(
          (item) =>
            Math.round(item.y) === Math.round(y) &&
            Math.round(item.x) === Math.round(xs[key]) &&
            item.str.trim() !== "",
        )[0]?.str ?? null;
    });
    plRow.row_location = {
      rowNumber: row + 1,
      pageNumber: packingListJson.pageInfo.num,
    };
    packingListContents.push(plRow);
  });
  return packingListContents;
}

module.exports = {
  mapParser,
  mapPdfParser,
  mapPdfNonAiParser,
};
