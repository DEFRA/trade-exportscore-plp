function createMessage(parsedResult) {
  return {
    body: parsedResult,
    type: "uk.gov.trade.plp",
    source: "trade-exportscore-plp",
  };
}

module.exports = createMessage;
