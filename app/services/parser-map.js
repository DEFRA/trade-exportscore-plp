const headers = require("./model-headers-pdf");
const pdfHelper = require("../utilities/pdf-helper");
const regex = require("../utilities/regex");

function findHeaderCols(header, packingListHeader) {
  const headerCols = {};
  // Process required columns
  const regexHeader = header.regex;
  for (const value in regexHeader) {
    headerCols[value] = Object.keys(packingListHeader).find((key) => {
      return regexHeader[value].test(packingListHeader[key]);
    });
  }
  // Process optional columns
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
  if (header.type_of_treatment) {
    headerCols.type_of_treatment = Object.keys(packingListHeader).find(
      (key) => {
        return header.type_of_treatment.test(packingListHeader[key]);
      },
    );
  }
  if (header.nirms) {
    headerCols.nirms = Object.keys(packingListHeader).find((key) => {
      return header.nirms.test(packingListHeader[key]);
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
  // find columns containing header names
  const headerCols = findHeaderCols(header, packingListJson[headerRow]);
  const netWeightUnit = header.findUnitInHeader
    ? (regex.findUnit(
        packingListJson[headerRow][headerCols.total_net_weight_kg],
      ) ??
      regex.findUnit(
        packingListJson[headerRow][headerCols.header_net_weight_unit],
      ))
    : null;

  // parse the packing list contents based on columns identified
  const packingListContents = packingListJson
    .slice(dataRow)
    .map((col, rowPos) => ({
      description: columnValue(col[headerCols.description]),
      nature_of_products: columnValue(col[headerCols.nature_of_products]),
      type_of_treatment: columnValue(col[headerCols.type_of_treatment]),
      commodity_code: columnValue(col[headerCols.commodity_code]),
      number_of_packages: columnValue(col[headerCols.number_of_packages]),
      total_net_weight_kg: columnValue(col[headerCols.total_net_weight_kg]),
      total_net_weight_unit:
        col[headerCols.total_net_weight_unit] ??
        (isNotEmpty(col, headerCols) && netWeightUnit) ??
        null,
      country_of_origin: columnValue(col[headerCols.country_of_origin]),
      nirms: columnValue(col[headerCols.nirms]),
      row_location: {
        rowNumber: dataRow + rowPos + 1,
        sheetName,
      },
    }));
  return packingListContents;
}

function columnValue(value) {
  return value ?? null;
}

function isNotEmpty(col, headerCols) {
  return (
    col[headerCols.description] ||
    col[headerCols.nature_of_products] ||
    col[headerCols.commodity_code] ||
    col[headerCols.number_of_packages] ||
    col[headerCols.total_net_weight_kg]
  );
}

function extractNetWeightUnit(packingListDocument, key) {
  if (!headers[key].findUnitInHeader) {
    return null;
  }
  const totalNetWeightHeader =
    packingListDocument.fields.TotalNetWeightHeader.content;
  return regex.findUnit(totalNetWeightHeader);
}

function getPageNumber(row, key, lastPageNumber) {
  return (
    row[headers[key].headers.description]?.boundingRegions?.[0]?.pageNumber ??
    lastPageNumber
  );
}

function createPackingListRow(
  row,
  key,
  netWeightUnit,
  currentItemNumber,
  currentPageNumber,
) {
  return {
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
    total_net_weight_unit: netWeightUnit ?? null,
    row_location: {
      rowNumber: currentItemNumber,
      pageNumber: currentPageNumber,
    },
  };
}

function mapPdfParser(packingListDocument, key) {
  if (!packingListDocument.fields.PackingListContents.values) {
    return [];
  }

  const netWeightUnit = extractNetWeightUnit(packingListDocument, key);
  const packingListContents = [];
  let currentItemNumber = 0;
  let lastPageNumber = 1;

  for (const value of packingListDocument.fields.PackingListContents.values) {
    const row = value.properties;
    const currentPageNumber = getPageNumber(row, key, lastPageNumber);

    if (lastPageNumber !== currentPageNumber) {
      lastPageNumber = currentPageNumber;
      currentItemNumber = 0;
    }
    currentItemNumber += 1;

    const plRow = createPackingListRow(
      row,
      key,
      netWeightUnit,
      currentItemNumber,
      currentPageNumber,
    );
    packingListContents.push(plRow);
  }
  return packingListContents;
}

function mapPdfNonAiParser(packingListJson, model, ys) {
  let netWeightUnit;
  if (headers[model].findUnitInHeader) {
    const pageHeader = pdfHelper.getHeaders(packingListJson.content, model);
    const totalNetWeightHeader = Object.values(pageHeader).find((x) =>
      headers[model].headers.total_net_weight_kg.regex.test(x),
    );
    netWeightUnit = regex.findUnit(totalNetWeightHeader);
  }

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
    plRow.commodity_code = extractIfFirstTenAreDigits(plRow.commodity_code);
    packingListContents.push(plRow);
  });

  return packingListContents;
}

function extractIfFirstTenAreDigits(input) {
  if (input === null) {
    return null;
  }

  const firstTen = input.slice(0, 10);
  return /^\d{10}$/.test(firstTen) ? firstTen : input;
}

function findItemContent(packingListJson, header, y) {
  const result = packingListJson.content.filter(
    (item) =>
      Math.abs(item.y - y) <= 1 &&
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
  extractNetWeightUnit,
};
