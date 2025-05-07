const headers = require("./model-headers");
const pdfHelper = require("../utilities/pdf-helper");
const regex = require("../utilities/regex");

function findHeaderCols(header, packingListHeader) {
  const headerCols = {};
  const regexHeader = header.regex;
  for (const value in regexHeader) {
    headerCols[value] = Object.keys(packingListHeader).find((key) => {
      return regexHeader[value].test(packingListHeader[key]);
    });
  }
  if (header.country_of_origin) {
    headerCols.country_of_origin = Object.keys(packingListHeader).find(
      (key) => {
        return header.country_of_origin.test(packingListHeader[key]);
      },
    );
  }
  if (header.total_net_weight_unit) {
    headerCols.total_net_weight_unit = Object.keys(packingListHeader).find(
      (key) => {
        return header.total_net_weight_unit.test(packingListHeader[key]);
      },
    );
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
  const netWeightUnit = header.findUnitInHeader
    ? regex.findUnit(packingListJson[headerRow][headerCols.total_net_weight_kg])
    : null;
  const packingListContents = packingListJson
    .slice(dataRow)
    .map((col, rowPos) => ({
      description: col[headerCols.description] ?? null,
      nature_of_products: col[headerCols.nature_of_products] ?? null,
      type_of_treatment: col[headerCols.type_of_treatment] ?? null,
      commodity_code: col[headerCols.commodity_code] ?? null,
      number_of_packages: col[headerCols.number_of_packages] ?? null,
      total_net_weight_kg: col[headerCols.total_net_weight_kg] ?? null,
      total_net_weight_unit:
        col[headerCols.total_net_weight_unit] ??
        (col[headerCols.total_net_weight_kg] && netWeightUnit) ??
        null,
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
    return [];
  }

  let currentItemNumber = 0;
  let lastPageNumber = 1;
  for (const value of packingListDocument.fields.PackingListContents.values) {
    const row = value.properties;
    const currentPageNumber =
      row[headers[key].headers.description]?.boundingRegions?.[0]?.pageNumber ??
      lastPageNumber;
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
      total_net_weight_unit:
        row[headers[key].headers.total_net_weight_kg]?.content ?? null,
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
  let netWeightUnit;
  if (headers[model].findUnitInHeader) {
    const pageHeader = pdfHelper.getHeaders(packingListJson.content, model);
    const totalNetWeightHeader = Object.values(pageHeader).find((x) =>
      headers[model].headers.total_net_weight_kg.regex.test(x),
    );
    netWeightUnit = regex.findUnit(totalNetWeightHeader);
  }

  const ys = pdfHelper.getYsForRows(packingListJson.content, model);
  const packingListContents = [];

  ys.forEach((y, row) => {
    const plRow = {
      description: null,
      nature_of_products: null,
      type_of_treatment: null,
      commodity_code: null,
      number_of_packages: null,
      total_net_weight_kg: null,
      total_net_weight_unit: netWeightUnit ?? null,
    };
    Object.keys(headers[model].headers).forEach((key) => {
      plRow[key] = findItemContent(
        packingListJson,
        headers[model].headers[key],
        y,
      );
    });
    plRow.row_location = {
      rowNumber: row + 1,
      pageNumber: packingListJson.pageInfo.num,
    };
    packingListContents.push(plRow);
  });

  return packingListContents;
}

function findItemContent(packingListJson, header, y) {
  const result = packingListJson.content.filter(
    (item) =>
      Math.round(item.y) === Math.round(y) &&
      Math.round(item.x) >= header.x1 &&
      Math.round(item.x) <= header.x2 &&
      item.str.trim() !== "",
  );
  if (result.length > 0) {
    return result.map((obj) => obj.str).join("");
  } else {
    return null;
  }
}

module.exports = {
  mapParser,
  mapPdfParser,
  mapPdfNonAiParser,
  findHeaderCols,
};
