/**
 * Groups text objects by X coordinate and Y coordinate proximity
 * Objects are grouped if they have the same X coordinate AND consecutive Y differences are within threshold
 *
 * @param {Array} textObjects - Array of text objects with x, y, str properties
 * @param {number} yThreshold - Maximum Y difference between consecutive objects to consider for grouping (default: 10)
 * @returns {Array} Grouped text objects with concatenated strings
 */
function groupByYCoordinate(textObjects, yThreshold = 10) {
  if (!textObjects || textObjects.length === 0) {
    return [];
  }

  // Sort by X coordinate first, then by Y coordinate to ensure proper grouping
  const sortedObjects = textObjects.slice().sort((a, b) => {
    if (a.x !== b.x) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });

  const grouped = [];
  let currentGroup = [sortedObjects[0]];

  for (let i = 1; i < sortedObjects.length; i++) {
    const current = sortedObjects[i];
    const previous = sortedObjects[i - 1];

    // Check if current object should be grouped with previous
    // Group only if X coordinates are the same AND Y difference is within threshold
    if (
      current.x === previous.x &&
      Math.abs(current.y - previous.y) < yThreshold
    ) {
      currentGroup.push(current);
    } else {
      // Process current group and start new one
      grouped.push(processGroup(currentGroup));
      currentGroup = [current];
    }
  }

  // Process the last group
  if (currentGroup.length > 0) {
    grouped.push(processGroup(currentGroup));
  }

  return grouped;
}

/**
 * Processes a group of text objects by concatenating their strings,
 * using properties from the first object in the group, and setting Y to the average
 *
 * @param {Array} group - Array of text objects to process
 * @returns {Object} Single text object with concatenated string and average Y coordinate
 */
function processGroup(group) {
  if (group.length === 1) {
    return group[0];
  }

  // Use the first object as base and concatenate all strings
  const baseObject = { ...group[0] };
  const concatenatedStr = group.map((obj) => obj.str).join(" ");

  // Use the largest width from all objects in the group
  const maxWidth = Math.max(...group.map((obj) => obj.width));

  // Calculate average Y coordinate of all objects in the group
  const averageY = group.reduce((sum, obj) => sum + obj.y, 0) / group.length;

  return {
    ...baseObject,
    str: concatenatedStr,
    width: maxWidth,
    y: averageY,
  };
}

module.exports = {
  groupByYCoordinate,
  processGroup,
};
