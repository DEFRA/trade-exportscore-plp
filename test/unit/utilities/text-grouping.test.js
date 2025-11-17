const { groupByYCoordinate } = require("../../../app/utilities/text-grouping");

describe("Text Grouping Utility", () => {
  describe("groupByYCoordinate", () => {
    test("should group objects with Y difference less than threshold", () => {
      const input = [
        {
          x: 75.27,
          y: 329.08,
          str: "100 BRIT APPLE PRESSE",
          dir: "ltr",
          width: 81.41175,
          height: 6.75,
          fontName: "Helvetica",
        },
        {
          x: 75.27,
          y: 341.33,
          str: "12 CHEESE & ONION ROLLS 300G",
          dir: "ltr",
          width: 109.917,
          height: 6.75,
          fontName: "Helvetica",
        },
        {
          x: 75.27,
          y: 353.57,
          str: "12 COLIN THE CATERPILLAR SPOTTY",
          dir: "ltr",
          width: 122.283,
          height: 6.75,
          fontName: "Helvetica",
        },
        {
          x: 75.27,
          y: 361.67,
          str: "CANDLES",
          dir: "ltr",
          width: 31.88025,
          height: 6.75,
          fontName: "Helvetica",
        },
        {
          x: 75.27,
          y: 373.92,
          str: "12 GARLIC DOUGHBALLS",
          dir: "ltr",
          width: 82.5255,
          height: 6.75,
          fontName: "Helvetica",
        },
      ];

      const expected = [
        {
          x: 75.27,
          y: 329.08,
          str: "100 BRIT APPLE PRESSE",
          dir: "ltr",
          width: 81.41175,
          height: 6.75,
          fontName: "Helvetica",
        },
        {
          x: 75.27,
          y: 341.33,
          str: "12 CHEESE & ONION ROLLS 300G",
          dir: "ltr",
          width: 109.917,
          height: 6.75,
          fontName: "Helvetica",
        },
        {
          x: 75.27,
          y: 357.62, // Average of 353.57 and 361.67
          str: "12 COLIN THE CATERPILLAR SPOTTY CANDLES",
          dir: "ltr",
          width: 122.283, // Max of 122.283 and 31.88025
          height: 6.75,
          fontName: "Helvetica",
        },
        {
          x: 75.27,
          y: 373.92,
          str: "12 GARLIC DOUGHBALLS",
          dir: "ltr",
          width: 82.5255,
          height: 6.75,
          fontName: "Helvetica",
        },
      ];

      const result = groupByYCoordinate(input, 10);
      expect(result).toEqual(expected);
    });

    test("should handle empty array", () => {
      expect(groupByYCoordinate([])).toEqual([]);
    });

    test("should handle single object", () => {
      const input = [
        {
          x: 10,
          y: 20,
          str: "test",
          width: 50,
        },
      ];
      expect(groupByYCoordinate(input)).toEqual(input);
    });

    test("should sort by Y coordinate before processing", () => {
      const input = [
        { x: 10, y: 30, str: "third", width: 20 },
        { x: 10, y: 10, str: "first", width: 20 },
        { x: 10, y: 20, str: "second", width: 20 },
      ];

      const result = groupByYCoordinate(input, 15);

      // Should group all three since differences are < 15
      expect(result).toHaveLength(1);
      expect(result[0].str).toBe("first second third");
      expect(result[0].y).toBe(20); // Should use average Y: (10 + 20 + 30) / 3 = 20
    });

    test("should use custom threshold", () => {
      const input = [
        { x: 10, y: 10, str: "first", width: 20 },
        { x: 10, y: 15, str: "second", width: 20 }, // difference of 5
      ];

      // With threshold 3, should not group
      const result1 = groupByYCoordinate(input, 3);
      expect(result1).toHaveLength(2);

      // With threshold 10, should group
      const result2 = groupByYCoordinate(input, 10);
      expect(result2).toHaveLength(1);
      expect(result2[0].str).toBe("first second");
    });

    test("should NOT group objects with different X coordinates", () => {
      const input = [
        { x: 10, y: 10, str: "left", width: 20 },
        { x: 50, y: 15, str: "right", width: 20 }, // different X, close Y
        { x: 10, y: 18, str: "left2", width: 20 }, // same X as first, close Y
      ];

      const result = groupByYCoordinate(input, 10);

      // Should have 2 groups: one for X=10 objects, one for X=50 object
      expect(result).toHaveLength(2);
      expect(result[0].str).toBe("left left2"); // X=10 objects grouped
      expect(result[0].x).toBe(10);
      expect(result[0].y).toBe(14); // Average of 10 and 18
      expect(result[0].width).toBe(20); // Max width (both are 20)
      expect(result[1].str).toBe("right"); // X=50 object separate
      expect(result[1].x).toBe(50);
    });

    test("should set Y coordinate to average of grouped objects", () => {
      const input = [
        { x: 100, y: 10, str: "first", width: 20 },
        { x: 100, y: 20, str: "second", width: 30 },
        { x: 100, y: 30, str: "third", width: 40 },
      ];

      const result = groupByYCoordinate(input, 25);

      expect(result).toHaveLength(1);
      expect(result[0].y).toBe(20); // (10 + 20 + 30) / 3 = 20
      expect(result[0].str).toBe("first second third");
      expect(result[0].width).toBe(40); // Max of 20, 30, 40 = 40
    });

    test("should use maximum width from grouped objects", () => {
      const input = [
        { x: 50, y: 100, str: "small", width: 15 },
        { x: 50, y: 105, str: "medium", width: 25 },
        { x: 50, y: 108, str: "large", width: 45 },
        { x: 50, y: 109, str: "tiny", width: 8 },
      ];

      const result = groupByYCoordinate(input, 10);

      expect(result).toHaveLength(1);
      expect(result[0].str).toBe("small medium large tiny");
      expect(result[0].width).toBe(45); // Maximum width from the group
    });
  });
});
