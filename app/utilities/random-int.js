/**
 * Random integer helper
 *
 * Produces a pseudo-random integer between `min` and `max` (inclusive)
 * using `crypto.randomBytes` as the entropy source. This is preferred over
 * `Math.random()` for unpredictability where a low-collision random id is
 * desired (not cryptographic tokens).
 */
const crypto = require("node:crypto");

/**
 * Generate a random integer using crypto.randomBytes.
 * @param {number} min - Minimum value (default: 1)
 * @param {number} max - Maximum value (default: 10000000)
 * @returns {number} Random integer in range
 */
function getRandomInt(min = 1, max = 10000000) {
  const range = max - min + 1;
  const randomBuffer = crypto.randomBytes(4); // Get 4 bytes of random data
  const randomValue = randomBuffer.readUInt32BE(0); // Read an unsigned 32-bit integer from the buffer
  return (randomValue % range) + min; // Limit to the specified range
}

module.exports = { getRandomInt };
