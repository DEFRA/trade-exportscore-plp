function rowFinder(packingList, callback) {
  return packingList.findIndex(callback);
}

module.exports = {
  rowFinder,
};
