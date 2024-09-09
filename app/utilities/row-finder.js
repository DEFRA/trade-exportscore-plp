function rowFinder(packingListArr, callback) {
  return packingListArr.findIndex(callback);
}

module.exports = {
  rowFinder,
};
