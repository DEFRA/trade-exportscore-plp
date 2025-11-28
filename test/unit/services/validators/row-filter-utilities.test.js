/**
 * Unit tests for row filter utilities
 */
const {
  isTotalsRow,
  isRepeatedHeaderRow,
  isEmptyRow,
  filterValidatableRows,
} = require("../../../../app/services/validators/row-filter-utilities");

describe("Row Filter Utilities", () => {
  describe("isTotalsRow", () => {
    const headerCols = {
      description: "A",
      commodity_code: "B",
      number_of_packages: "C",
      total_net_weight_kg: "D",
      gross_weight_kg: "E",
    };

    const config = {
      skipTotalsRows: true,
      totalsRowKeywords: ["TOTAL", "SUBTOTAL", "SUM", "SUMMARY", "GRAND TOTAL"],
      totalsRowPattern: {
        hasNumericOnly: true,
        descriptionEmpty: true,
        commodityCodeEmpty: true,
      },
    };

    test("should identify row with TOTAL keyword in description", () => {
      const row = {
        A: "TOTAL",
        B: null,
        C: 100,
        D: 500,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(true);
    });

    test("should identify row with SUBTOTAL keyword in description", () => {
      const row = {
        A: "SUBTOTAL",
        B: null,
        C: 50,
        D: 250,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(true);
    });

    test("should identify row with GRAND TOTAL keyword", () => {
      const row = {
        A: "GRAND TOTAL",
        B: "",
        C: 200,
        D: 1000,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(true);
    });

    test("should be case-insensitive for keywords", () => {
      const row = {
        A: "total",
        B: null,
        C: 100,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(true);
    });

    test("should identify totals row with empty description and commodity code but numeric data", () => {
      const row = {
        A: null,
        B: null,
        C: 75,
        D: 300,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(true);
    });

    test("should NOT identify row with description as totals row", () => {
      const row = {
        A: "Product Name",
        B: null,
        C: 10,
        D: 50,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(false);
    });

    test("should NOT identify row with commodity code as totals row", () => {
      const row = {
        A: null,
        B: "0123456789",
        C: 10,
        D: 50,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(false);
    });

    test("should identify row with only number_of_packages populated", () => {
      const row = {
        A: "",
        B: "",
        C: 25,
        D: null,
        E: null,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(true);
    });

    test("should identify row with only total_net_weight_kg populated", () => {
      const row = {
        A: null,
        B: null,
        C: null,
        D: 150,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(true);
    });

    test("should identify row with only gross_weight_kg populated", () => {
      const row = {
        A: "",
        B: "",
        C: null,
        D: null,
        E: 200,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(true);
    });

    test("should return false when skipTotalsRows is false", () => {
      const row = {
        A: "TOTAL",
        B: null,
        C: 100,
      };
      const configDisabled = { ...config, skipTotalsRows: false };
      expect(isTotalsRow(row, headerCols, configDisabled)).toBe(false);
    });

    test("should return false when config has no totalsRowKeywords", () => {
      const row = {
        A: "TOTAL",
        B: null,
        C: 100,
      };
      const configNoKeywords = {
        skipTotalsRows: true,
        totalsRowPattern: config.totalsRowPattern,
      };
      expect(isTotalsRow(row, headerCols, configNoKeywords)).toBe(false);
    });

    test("should handle null/undefined values in row", () => {
      const row = {
        A: undefined,
        B: null,
        C: null,
        D: null,
      };
      expect(isTotalsRow(row, headerCols, config)).toBe(false);
    });

    test("should handle whitespace-only description", () => {
      const row = {
        A: "   ",
        B: "",
        C: 50,
        D: 100,
      };
      // Whitespace description is considered "empty", so totals pattern matches
      expect(isTotalsRow(row, headerCols, config)).toBe(true);
    });
  });

  describe("isRepeatedHeaderRow", () => {
    const headerCols = {
      description: "A",
      commodity_code: "B",
      number_of_packages: "C",
      total_net_weight_kg: "D",
    };

    const originalHeaderRow = {
      A: "ITEM DESCRIPTION",
      B: "Commodity Code",
      C: "TOTAL NUMBER OF CASES",
      D: "Net Weight",
    };

    const config = {
      skipRepeatedHeaders: true,
      regex: {
        description: /ITEM DESCRIPTION/i,
        commodity_code: /Commodity Code/i,
        number_of_packages: /TOTAL NUMBER OF CASES/i,
        total_net_weight_kg: /Net Weight/i,
      },
    };

    test("should identify row with exact header values", () => {
      const row = {
        A: "ITEM DESCRIPTION",
        B: "Commodity Code",
        C: "TOTAL NUMBER OF CASES",
        D: "Net Weight",
      };
      expect(
        isRepeatedHeaderRow(row, originalHeaderRow, headerCols, config),
      ).toBe(true);
    });

    test("should be case-insensitive when matching headers", () => {
      const row = {
        A: "item description",
        B: "commodity code",
        C: "total number of cases",
        D: "net weight",
      };
      expect(
        isRepeatedHeaderRow(row, originalHeaderRow, headerCols, config),
      ).toBe(true);
    });

    test("should NOT identify row with partial header matches (not all match)", () => {
      const row = {
        A: "ITEM DESCRIPTION",
        B: "Commodity Code",
        C: "TOTAL NUMBER OF CASES",
        D: "Different Value",
      };
      // 3 out of 4 matches = not 100%, so should return false
      expect(
        isRepeatedHeaderRow(row, originalHeaderRow, headerCols, config),
      ).toBe(false);
    });

    test("should NOT identify row with partial matches below threshold", () => {
      const row = {
        A: "ITEM DESCRIPTION",
        B: "Different Value",
        C: "Another Value",
        D: "Yet Another",
      };
      // 1 out of 4 matches = 25% < 60% threshold
      expect(
        isRepeatedHeaderRow(row, originalHeaderRow, headerCols, config),
      ).toBe(false);
    });

    test("should NOT identify row with only one match (needs 100%)", () => {
      const row = {
        A: "ITEM DESCRIPTION",
        B: "Different",
        C: "Different",
        D: "Different",
      };
      const configLowThreshold = { ...config, headerMatchThreshold: 0.25 };
      // Only 1 out of 4 matches = not 100%, threshold ignored
      expect(
        isRepeatedHeaderRow(
          row,
          originalHeaderRow,
          headerCols,
          configLowThreshold,
        ),
      ).toBe(false);
    });

    test("should require all fields to match (100% match required)", () => {
      const row = {
        A: "ITEM DESCRIPTION",
        B: "Commodity Code",
        C: "TOTAL NUMBER OF CASES",
        D: "Different",
      };
      const configNoThreshold = {
        skipRepeatedHeaders: true,
        regex: {
          description: /ITEM DESCRIPTION/i,
          commodity_code: /Commodity Code/i,
          number_of_packages: /TOTAL NUMBER OF CASES/i,
          total_net_weight_kg: /Net Weight/i,
        },
      };
      // 3 out of 4 = 75%, but needs 100%
      expect(
        isRepeatedHeaderRow(
          row,
          originalHeaderRow,
          headerCols,
          configNoThreshold,
        ),
      ).toBe(false);
    });

    test("should return false when skipRepeatedHeaders is false", () => {
      const row = {
        A: "ITEM DESCRIPTION",
        B: "Commodity Code",
        C: "TOTAL NUMBER OF CASES",
        D: "Net Weight",
      };
      const configDisabled = { ...config, skipRepeatedHeaders: false };
      expect(
        isRepeatedHeaderRow(row, originalHeaderRow, headerCols, configDisabled),
      ).toBe(false);
    });

    test("should return false when no mapped fields exist", () => {
      const row = { A: "Test" };
      const emptyHeaderCols = {};
      expect(
        isRepeatedHeaderRow(row, originalHeaderRow, emptyHeaderCols, config),
      ).toBe(false);
    });

    test("should handle missing values in row or originalHeaderRow", () => {
      const row = {
        A: null,
        B: undefined,
        C: undefined,
        D: "Net Weight",
      };
      // Only 1 out of 4 matches = 25% < 60% threshold
      expect(
        isRepeatedHeaderRow(row, originalHeaderRow, headerCols, config),
      ).toBe(false);
    });

    test("should NOT match headers with partial substring (exact match only)", () => {
      const row = {
        A: "ITEM DESC", // Partial match, not exact
        B: "Commo", // Partial match, not exact
        C: "TOTAL", // Partial match, not exact
        D: "Net W", // Partial match, not exact
      };
      // Partial matches don't count - exact match required
      expect(
        isRepeatedHeaderRow(row, originalHeaderRow, headerCols, config),
      ).toBe(false);
    });
  });

  describe("isEmptyRow", () => {
    const headerCols = {
      description: "A",
      commodity_code: "B",
      number_of_packages: "C",
    };

    test("should identify row with all empty columns", () => {
      const row = {
        A: "",
        B: "",
        C: "",
      };
      expect(isEmptyRow(row, headerCols)).toBe(true);
    });

    test("should identify row with all null columns", () => {
      const row = {
        A: null,
        B: null,
        C: null,
      };
      expect(isEmptyRow(row, headerCols)).toBe(true);
    });

    test("should identify row with all whitespace columns", () => {
      const row = {
        A: "   ",
        B: "  ",
        C: "\t",
      };
      expect(isEmptyRow(row, headerCols)).toBe(true);
    });

    test("should NOT identify row with at least one populated column", () => {
      const row = {
        A: "",
        B: "Value",
        C: "",
      };
      expect(isEmptyRow(row, headerCols)).toBe(false);
    });

    test("should handle missing column keys gracefully", () => {
      const row = {
        A: "",
        B: "",
      };
      const headerColsWithNull = {
        description: "A",
        commodity_code: "B",
        number_of_packages: null,
      };
      expect(isEmptyRow(row, headerColsWithNull)).toBe(true);
    });

    test("should handle undefined values", () => {
      const row = {
        A: undefined,
        B: undefined,
        C: undefined,
      };
      expect(isEmptyRow(row, headerCols)).toBe(true);
    });
  });

  describe("filterValidatableRows", () => {
    const headerCols = {
      description: "A",
      commodity_code: "B",
      number_of_packages: "C",
      total_net_weight_kg: "D",
    };

    const config = {
      skipTotalsRows: true,
      skipRepeatedHeaders: true,
      totalsRowKeywords: ["TOTAL"],
      totalsRowPattern: {
        hasNumericOnly: true,
        descriptionEmpty: true,
        commodityCodeEmpty: true,
      },
      regex: {
        description: /ITEM DESCRIPTION/i,
        commodity_code: /Commodity Code/i,
        number_of_packages: /Cases/i,
        total_net_weight_kg: /Weight/i,
      },
    };

    test("should filter out empty rows", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" }, // Header row 0
        { A: "Product 1", B: "0123456789", C: 10, D: 50 }, // Data row 1
        { A: "", B: "", C: "", D: "" }, // Empty row 2
        { A: "Product 2", B: "0987654321", C: 20, D: 100 }, // Data row 3
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(2);
      expect(result[0].row.A).toBe("Product 1");
      expect(result[1].row.A).toBe("Product 2");
    });

    test("should filter out totals rows by keyword", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
        { A: "TOTAL", B: null, C: 10, D: 50 },
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(1);
      expect(result[0].row.A).toBe("Product 1");
    });

    test("should filter out totals rows by pattern", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
        { A: null, B: null, C: 10, D: 50 }, // Totals row - numeric only
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(1);
      expect(result[0].row.A).toBe("Product 1");
    });

    test("should filter out repeated header rows", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" }, // Repeated header
        { A: "Product 2", B: "0987654321", C: 20, D: 100 },
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(2);
      expect(result[0].row.A).toBe("Product 1");
      expect(result[1].row.A).toBe("Product 2");
    });

    test("should keep valid data rows", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
        { A: "Product 2", B: "0987654321", C: 20, D: 100 },
        { A: "Product 3", B: "1122334455", C: 15, D: 75 },
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(3);
      expect(result[0].row.A).toBe("Product 1");
      expect(result[1].row.A).toBe("Product 2");
      expect(result[2].row.A).toBe("Product 3");
    });

    test("should preserve correct row numbers after filtering", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" }, // Row 0
        { A: "Product 1", B: "0123456789", C: 10, D: 50 }, // Row 1
        { A: "", B: "", C: "", D: "" }, // Row 2 (empty - filtered)
        { A: "Product 2", B: "0987654321", C: 20, D: 100 }, // Row 3
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(2);
      expect(result[0].actualRowNumber).toBe(2); // Row 1 + 1 (1-based)
      expect(result[1].actualRowNumber).toBe(4); // Row 3 + 1 (1-based)
    });

    test("should preserve sheet name in metadata", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "TestSheet",
      );

      expect(result[0].sheetName).toBe("TestSheet");
    });

    test("should filter multiple totals rows and headers from same dataset", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
        { A: "TOTAL", B: null, C: 10, D: 50 },
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 2", B: "0987654321", C: 20, D: 100 },
        { A: null, B: null, C: 20, D: 100 },
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(2);
      expect(result[0].row.A).toBe("Product 1");
      expect(result[1].row.A).toBe("Product 2");
    });

    test("should handle dataset with no rows to filter", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
        { A: "Product 2", B: "0987654321", C: 20, D: 100 },
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(2);
    });

    test("should return empty array when all rows filtered", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "", B: "", C: "", D: "" },
        { A: "TOTAL", B: null, C: 10, D: 50 },
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(0);
    });

    test("should not filter when skipTotalsRows is false", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
        { A: "TOTAL", B: null, C: 10, D: 50 },
      ];

      const configNoTotalsFilter = { ...config, skipTotalsRows: false };
      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        configNoTotalsFilter,
        "Sheet1",
      );

      expect(result).toHaveLength(2); // Both rows kept
    });

    test("should not filter when skipRepeatedHeaders is false", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
      ];

      const configNoHeaderFilter = { ...config, skipRepeatedHeaders: false };
      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        configNoHeaderFilter,
        "Sheet1",
      );

      expect(result).toHaveLength(2); // Both rows kept
    });

    test("should apply both filters when both enabled", () => {
      const packingListJson = [
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" },
        { A: "Product 1", B: "0123456789", C: 10, D: 50 },
        { A: "TOTAL", B: null, C: 10, D: 50 }, // Filtered by totals
        { A: "ITEM DESCRIPTION", B: "Commodity Code", C: "Cases", D: "Weight" }, // Filtered by header
        { A: "Product 2", B: "0987654321", C: 20, D: 100 },
      ];

      const result = filterValidatableRows(
        packingListJson,
        0,
        1,
        headerCols,
        config,
        "Sheet1",
      );

      expect(result).toHaveLength(2);
      expect(result[0].row.A).toBe("Product 1");
      expect(result[1].row.A).toBe("Product 2");
    });
  });
});
