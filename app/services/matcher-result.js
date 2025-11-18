/**
 * Matcher result enumeration
 *
 * Frozen enumeration of possible matcher outcomes used throughout the matcher-parser pipeline.
 * Object is frozen for immutability and slight performance gain.
 */

const MatcherResult = Object.freeze({
  WRONG_EXTENSION: 0,
  WRONG_ESTABLISHMENT_NUMBER: 1,
  WRONG_HEADER: 2,
  GENERIC_ERROR: 3,
  CORRECT: 4,
  EMPTY_FILE: 5,
});

module.exports = MatcherResult;
