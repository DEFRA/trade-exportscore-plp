/**
 * Parser mapping utilities
 *
 * Provides mapping functions to transform raw packing list data (Excel, PDF AI, PDF non-AI)
 * into standardized item structures. Handles header detection, blanket values, and column mapping.
 */
const headers = require("./model-headers-pdf");
const pdfHelper = require("../utilities/pdf-helper");
const regex = require("../utilities/regex");
const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { filterValidatableRows } = require("./validators/row-filter-utilities");

/**
 * Find column keys matching header regex patterns.
 * @param {Object} header - Header configuration with regex patterns
 * @param {Object} packingListHeader - Header row from packing list
 * @returns {Object} Mapped column keys
 */
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
  if (header.commodity_code) {
    headerCols.commodity_code = Object.keys(packingListHeader).find((key) => {
      return header.commodity_code.test(packingListHeader[key]);
    });
  }
  if (header.nature_of_products) {
    headerCols.nature_of_products = Object.keys(packingListHeader).find(
      (key) => {
        return header.nature_of_products.test(packingListHeader[key]);
      },
    );
  }
  if (header.box_number) {
    headerCols.box_number = Object.keys(packingListHeader).find((key) => {
      return header.box_number.test(packingListHeader[key]);
    });
  }
  return headerCols;
}

/**
 * Map Excel/CSV data rows to standardized packing list items.
 * @param {Array<Object>} packingListJson - Raw packing list data
 * @param {number} headerRow - Row index containing headers
 * @param {number} dataRow - First row index containing data
 * @param {Object} header - Header configuration
 * @param {string|null} sheetName - Sheet name for row location
 * @returns {Array<Object>} Mapped packing list items
 */
function mapParser(
  packingListJson,
  headerRow,
  dataRow,
  header,
  sheetName = null,
) {
  // find columns containing header names
  const headerCols = findHeaderCols(header, packingListJson[headerRow]);

  // extract blanket values
  const blanketValues = extractBlanketValues(
    header,
    packingListJson,
    headerCols,
    headerRow,
  );

  // Filter rows if configuration is present
  let rowsToProcess;
  if (header.skipTotalsRows || header.skipRepeatedHeaders) {
    rowsToProcess = filterValidatableRows(
      packingListJson,
      headerRow,
      dataRow,
      headerCols,
      header,
      sheetName,
    );
  } else {
    // Fallback to original behavior
    rowsToProcess = packingListJson.slice(dataRow).map((row, index) => ({
      row,
      originalIndex: dataRow + index,
      actualRowNumber: dataRow + index + 1,
      sheetName,
    }));
  }

  // Filter out rows with box numbers if configured
  if (header.skipBoxNumberRows && headerCols.box_number) {
    rowsToProcess = rowsToProcess.filter(({ row }) => {
      const boxNumberValue = row[headerCols.box_number];
      return !boxNumberValue || String(boxNumberValue).trim() === "";
    });
  }

  // parse the packing list contents based on columns identified
  const packingListContents = rowsToProcess.map(
    ({ row: col, actualRowNumber }) => {
      const hasData = isNotEmpty(col, headerCols);

      return {
        description: columnValue(col[headerCols.description]),
        nature_of_products: columnValue(col[headerCols.nature_of_products]),
        type_of_treatment: getTypeOfTreatment(
          col,
          headerCols,
          blanketValues,
          hasData,
        ),
        commodity_code: columnValue(col[headerCols.commodity_code]),
        number_of_packages: columnValue(col[headerCols.number_of_packages]),
        total_net_weight_kg: columnValue(col[headerCols.total_net_weight_kg]),
        total_net_weight_unit: getNetWeightUnit(
          col,
          headerCols,
          blanketValues,
          hasData,
        ),
        country_of_origin: columnValue(col[headerCols.country_of_origin]),
        nirms: getNirms(col, headerCols, blanketValues, hasData),
        row_location: {
          rowNumber: actualRowNumber,
          sheetName,
        },
      };
    },
  );
  return packingListContents;
}

/**
 * Extract blanket values (applies to all rows) from document.
 * @param {Object} header - Header configuration
 * @param {Array<Object>} packingListJson - Raw packing list data
 * @param {Object} headerCols - Mapped header columns
 * @param {number} headerRow - Header row index
 * @returns {Object} Blanket values (netWeightUnit, blanketNirms, blanketTreatmentType)
 */
function extractBlanketValues(header, packingListJson, headerCols, headerRow) {
  const netWeightUnit = header.findUnitInHeader
    ? (regex.findUnit(
        packingListJson[headerRow][headerCols.total_net_weight_kg],
      ) ??
      regex.findUnit(
        packingListJson[headerRow][headerCols.header_net_weight_unit],
      ))
    : null;
  const blanketNirms = regex.test(header.blanketNirms?.regex, packingListJson)
    ? header.blanketNirms?.value
    : null;

  let blanketTreatmentType = null;
  if (
    header.blanketTreatmentType &&
    regex.test(header.blanketTreatmentType?.regex, packingListJson)
  ) {
    blanketTreatmentType = header.blanketTreatmentType.value;
  }
  if (blanketTreatmentType === null && header.blanketTreatmentTypeValue) {
    blanketTreatmentType = getBlanketValueFromOffset(
      packingListJson,
      header.blanketTreatmentTypeValue,
    );
  }

  return {
    netWeightUnit,
    blanketNirms,
    blanketTreatmentType,
  };
}

/**
 * Extract blanket value from document using coordinate offsets.
 * @param {Array<Object>} packingListJson - Raw packing list data
 * @param {Object} blanketValue - Configuration with regex and offset
 * @returns {string|null} Extracted value or null
 */
function getBlanketValueFromOffset(packingListJson, blanketValue) {
  try {
    // find position of blanket header value
    const [headerRow, headerCol] = regex.positionFinder(
      packingListJson,
      blanketValue.regex,
    );

    if (headerRow === null || headerCol === null) {
      throw new Error("Position not found.");
    }

    // add offsets
    const row = headerRow + blanketValue.valueCellOffset.row;
    const col = String.fromCodePoint(
      headerCol.codePointAt(0) + blanketValue.valueCellOffset.col,
    );

    // return the value
    return packingListJson[row][col] ?? null;
  } catch (error) {
    logger.logError(filenameForLogging, "getBlanketValueFromOffset()", error);
    return null;
  }
}

/**
 * Get type of treatment with fallback to blanket value.
 * @param {Object} col - Data row
 * @param {Object} headerCols - Mapped columns
 * @param {Object} blanketValues - Blanket values
 * @param {boolean} hasData - Whether row has data
 * @returns {string|null} Type of treatment
 */
function getTypeOfTreatment(col, headerCols, blanketValues, hasData) {
  return (
    columnValue(col[headerCols.type_of_treatment]) ??
    (hasData && blanketValues.blanketTreatmentType) ??
    null
  );
}

/**
 * Get net weight unit with fallback to blanket value.
 * @param {Object} col - Data row
 * @param {Object} headerCols - Mapped columns
 * @param {Object} blanketValues - Blanket values
 * @param {boolean} hasData - Whether row has data
 * @returns {string|null} Net weight unit
 */
function getNetWeightUnit(col, headerCols, blanketValues, hasData) {
  return (
    col[headerCols.total_net_weight_unit] ??
    (hasData && blanketValues.netWeightUnit) ??
    null
  );
}

/**
 * Get NIRMS with fallback to blanket value.
 * @param {Object} col - Data row
 * @param {Object} headerCols - Mapped columns
 * @param {Object} blanketValues - Blanket values
 * @param {boolean} hasData - Whether row has data
 * @returns {string|null} NIRMS value
 */
function getNirms(col, headerCols, blanketValues, hasData) {
  return (
    columnValue(col[headerCols.nirms]) ??
    (hasData && blanketValues.blanketNirms) ??
    null
  );
}

/**
 * Return column value or null if undefined.
 * @param {*} value - Value to check
 * @returns {*} Value or null
 */
function columnValue(value) {
  return value ?? null;
}

/**
 * Check if row has any non-empty data in mapped columns.
 * @param {Object} col - Data row
 * @param {Object} headerCols - Mapped columns
 * @returns {boolean} True if row has data
 */
function isNotEmpty(col, headerCols) {
  const firstCol = Object.values(headerCols).find((name) => col[name]);
  return firstCol ? col[firstCol] : undefined;
}

/**
 * Extract net weight unit from PDF document header.
 * @param {Object} packingListDocument - Parsed PDF document
 * @param {string} key - Header configuration key
 * @returns {string|null} Net weight unit or null
 */
function extractNetWeightUnit(packingListDocument, key) {
  if (!headers[key].findUnitInHeader) {
    return null;
  }
  const totalNetWeightHeader =
    packingListDocument.fields.TotalNetWeightHeader.content;
  return regex.findUnit(totalNetWeightHeader);
}

/**
 * Extract page number from PDF row with fallback to last known page.
 * @param {Object} row - PDF row data
 * @param {string} key - Header configuration key
 * @param {number} lastPageNumber - Last known page number
 * @returns {number} Page number
 */
function getPageNumber(row, key, lastPageNumber) {
  return (
    row[headers[key].headers.description]?.boundingRegions?.[0]?.pageNumber ??
    lastPageNumber
  );
}

/**
 * Create standardized packing list row from PDF data.
 * @param {Object} row - PDF row data
 * @param {string} key - Header configuration key
 * @param {string|null} netWeightUnit - Net weight unit
 * @param {number} currentItemNumber - Item number on page
 * @param {number} currentPageNumber - Current page number
 * @returns {Object} Standardized packing list row
 */
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
      Number.parseFloat(
        row[headers[key].headers.total_net_weight_kg]?.content,
      ) ?? null,
    total_net_weight_unit: netWeightUnit ?? null,
    row_location: {
      rowNumber: currentItemNumber,
      pageNumber: currentPageNumber,
    },
    nirms: row[headers[key].headers.nirms]?.value ?? null,
    country_of_origin:
      row[headers[key].headers.country_of_origin]?.value ?? null,
  };
}

/**
 * Map PDF AI parsed document to standardized packing list items.
 * @param {Object} packingListDocument - Azure Form Recognizer result
 * @param {string} key - Header configuration key
 * @returns {Array<Object>} Mapped packing list items
 */
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

/**
 * Map PDF non-AI parsed data (coordinate-based) to standardized items.
 * @param {Object} packingListJson - PDF content with coordinates
 * @param {string} model - Parser model identifier
 * @param {Array<number>} ys - Y-coordinates of data rows
 * @param {boolean} nirmsHeaderExists - Flag indicating if NIRMS header exists
 * @param {boolean} coHeaderExists - Flag indicating if Country of Origin header exists
 * @returns {Array<Object>} Mapped packing list items
 */
function mapPdfNonAiParser(
  packingListJson,
  model,
  ys,
  nirmsHeaderExists = false,
  coHeaderExists = false,
) {
  let netWeightUnit;
  if (headers[model].findUnitInHeader) {
    const pageHeader = pdfHelper.getHeaders(packingListJson.content, model);
    const totalNetWeightHeader = Object.values(pageHeader).find((x) =>
      headers[model].headers.total_net_weight_kg.regex.test(x),
    );
    netWeightUnit = regex.findUnit(totalNetWeightHeader);
  }

  const packingListContents = [];

  for (let row = 0; row < ys.length; row++) {
    const y = ys[row];
    const plRow = {
      description: null,
      nature_of_products: null,
      type_of_treatment: null,
      commodity_code: null,
      number_of_packages: null,
      total_net_weight_kg: null,
      total_net_weight_unit: netWeightUnit ?? null,
    };

    for (const key of Object.keys(headers[model].headers)) {
      plRow[key] = findItemContent(
        packingListJson,
        headers[model].headers[key],
        y,
      );
    }

    if (headers[model].nirms && nirmsHeaderExists) {
      plRow.nirms = findItemContent(packingListJson, headers[model].nirms, y);
    }

    if (headers[model].country_of_origin && coHeaderExists) {
      plRow.country_of_origin = findItemContent(
        packingListJson,
        headers[model].country_of_origin,
        y,
      );
    }

    plRow.row_location = {
      rowNumber: row + 1,
      pageNumber: packingListJson.pageInfo.num,
    };
    plRow.commodity_code = extractCommodityCodeDigits(plRow.commodity_code);
    packingListContents.push(plRow);
  }

  return packingListContents;
}

/**
 * Extract 4-14 digit commodity code from input string.
 * @param {string|null} input - Input string to extract from
 * @returns {string|null} Extracted digits or original input
 */
function extractCommodityCodeDigits(input) {
  if (input === null) {
    return null;
  }

  // Match if input starts with 4 to 14 digits
  const match = new RegExp(/^(\d{4,14})/).exec(input);
  if (match) {
    return match[1];
  }
  return input;
}

/**
 * Find content items at specific Y-coordinate within X-range.
 * @param {Object} packingListJson - PDF content with coordinates
 * @param {Object} header - Header with x1, x2 range
 * @param {number} y - Y-coordinate to search
 * @returns {string|null} Concatenated content or null
 */
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
  getBlanketValueFromOffset,
  isNotEmpty,
};
