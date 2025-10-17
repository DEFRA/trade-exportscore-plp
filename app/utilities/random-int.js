const crypto = require("node:crypto");

function getRandomInt(min = 1, max = 10000000) {
  const range = max - min + 1;
  const randomBuffer = crypto.randomBytes(4); // Get 4 bytes of random data
  const randomValue = randomBuffer.readUInt32BE(0); // Read an unsigned 32-bit integer from the buffer
  return (randomValue % range) + min; // Limit to the specified range
}

module.exports = { getRandomInt };
