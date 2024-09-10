// Object.freeze() has been used to both freeze the object (make it imutable which is preferable where possible to avoid future bugs)
// and to improve performance slightly (not essential but a benefit from freezing)
const MatcherResult = Object.freeze({
  WRONG_EXTENSION: 0,
  WRONG_ESTABLISHMENT_NUMBER: 1,
  WRONG_HEADER: 2,
  GENERIC_ERROR: 3,
  CORRECT: 4,
});

module.exports = MatcherResult;
