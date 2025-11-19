/**
 * Row filtering utilities for excluding totals rows and repeated headers
 * from packing list validation
 */

/**
 * Check if a row is a totals/summary row
 * @param {Object} row - The data row
 * @param {Object} headerCols - Column mappings
 * @param {Object} config - Model configuration with totals detection settings
 * @returns {boolean} - True if row is a totals row
 */
function isTotalsRow(row, headerCols, config) {
  if (!config.skipTotalsRows) return false;

  // Check for totals keywords in description field
  if (hasTotalsKeyword(row, headerCols, config)) {
    return true;
  }

  // Check for totals row pattern
  if (config.totalsRowPattern) {
    return matchesTotalsPattern(row, headerCols, config.totalsRowPattern);
  }

  return false;
}

/**
 * Check if row has totals keyword in description
 * @param {Object} row - The data row
 * @param {Object} headerCols - Column mappings
 * @param {Object} config - Model configuration
 * @returns {boolean} - True if totals keyword found
 */
function hasTotalsKeyword(row, headerCols, config) {
  if (!config.totalsRowKeywords || !headerCols.description) {
    return false;
  }

  const description = row[headerCols.description];
  if (!description || typeof description !== "string") {
    return false;
  }

  const keywordsPattern = new RegExp(
    `\\b(${config.totalsRowKeywords.join("|")})\\b`,
    "i",
  );
  return keywordsPattern.test(description);
}

/**
 * Check if row matches totals pattern
 * @param {Object} row - The data row
 * @param {Object} headerCols - Column mappings
 * @param {Object} pattern - Totals row pattern configuration
 * @returns {boolean} - True if matches pattern
 */
function matchesTotalsPattern(row, headerCols, pattern) {
  // Check if description is empty when required
  if (
    pattern.descriptionEmpty &&
    hasNonEmptyField(row, headerCols.description)
  ) {
    return false;
  }

  // Check if commodity code is empty when required
  if (
    pattern.commodityCodeEmpty &&
    hasNonEmptyField(row, headerCols.commodity_code)
  ) {
    return false;
  }

  // Check if only numeric fields are populated
  if (pattern.hasNumericOnly) {
    return hasNumericData(row, headerCols);
  }

  return false;
}

/**
 * Check if a field has non-empty value
 * @param {Object} row - The data row
 * @param {string} colKey - Column key
 * @returns {boolean} - True if field has content
 */
function hasNonEmptyField(row, colKey) {
  if (!colKey) return false;
  const value = row[colKey];
  return value && typeof value === "string" && value.trim().length > 0;
}

/**
 * Check if row has numeric data in weight/package fields
 * @param {Object} row - The data row
 * @param {Object} headerCols - Column mappings
 * @returns {boolean} - True if has numeric data
 */
function hasNumericData(row, headerCols) {
  return !!(
    (headerCols.number_of_packages && row[headerCols.number_of_packages]) ||
    (headerCols.total_net_weight_kg && row[headerCols.total_net_weight_kg]) ||
    (headerCols.gross_weight_kg && row[headerCols.gross_weight_kg])
  );
}

/**
 * Check if a row is a repeated header row
 * @param {Object} row - The data row
 * @param {Object} originalHeaderRow - The original header row from sheet
 * @param {Object} headerCols - Column mappings
 * @param {Object} config - Model configuration
 * @returns {boolean} - True if row is a repeated header
 */
function isRepeatedHeaderRow(row, originalHeaderRow, headerCols, config) {
  if (!config.skipRepeatedHeaders) return false;

  let headerMatches = 0;
  const mappedFields = Object.entries(headerCols).filter(
    ([field, colKey]) => colKey,
  );
  const totalMappedFields = mappedFields.length;

  if (totalMappedFields === 0) return false;

  for (const entry of mappedFields) {
    const colKey = entry[1];
    if (row[colKey] && originalHeaderRow[colKey]) {
      const currentValue = String(row[colKey]).toLowerCase().trim();
      const headerValue = String(originalHeaderRow[colKey])
        .toLowerCase()
        .trim();

      // Check for exact match or partial header text match
      if (
        currentValue === headerValue ||
        (headerValue.length >= 5 &&
          currentValue.includes(headerValue.substring(0, 5))) ||
        (currentValue.length >= 5 &&
          headerValue.includes(currentValue.substring(0, 5)))
      ) {
        headerMatches++;
      }
    }
  }

  // Use configured threshold or default to 60%
  const threshold = config.headerMatchThreshold || 0.6;
  return headerMatches >= Math.floor(totalMappedFields * threshold);
}

/**
 * Check if a row is empty (all mapped columns are empty)
 * @param {Object} row - The data row
 * @param {Object} headerCols - Column mappings
 * @returns {boolean} - True if row is empty
 */
function isEmptyRow(row, headerCols) {
  return Object.values(headerCols).every(
    (colKey) => !colKey || !row[colKey] || String(row[colKey]).trim() === "",
  );
}

/**
 * Filter rows to exclude totals, headers, and empty rows from validation
 * @param {Array} packingListJson - Raw sheet data
 * @param {number} headerRowIndex - Index of header row
 * @param {number} dataStartRow - Index where data starts
 * @param {Object} headerCols - Column mappings
 * @param {Object} config - Model configuration
 * @param {string} sheetName - Sheet name for error reporting
 * @returns {Array} - Filtered rows with metadata
 */
function filterValidatableRows(
  packingListJson,
  headerRowIndex,
  dataStartRow,
  headerCols,
  config,
  sheetName,
) {
  const originalHeaderRow = packingListJson[headerRowIndex];

  return packingListJson
    .slice(dataStartRow)
    .map((row, index) => ({
      row,
      originalIndex: dataStartRow + index,
      actualRowNumber: dataStartRow + index + 1,
      sheetName,
    }))
    .filter(({ row }) => {
      // Skip empty rows
      if (isEmptyRow(row, headerCols)) return false;

      // Skip totals rows
      if (isTotalsRow(row, headerCols, config)) return false;

      // Skip repeated header rows
      if (isRepeatedHeaderRow(row, originalHeaderRow, headerCols, config))
        return false;

      return true;
    });
}

module.exports = {
  isTotalsRow,
  isRepeatedHeaderRow,
  isEmptyRow,
  filterValidatableRows,
};
