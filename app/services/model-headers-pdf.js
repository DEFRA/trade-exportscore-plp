const { pdfIcelandHeaders } = require("./model-headers/iceland");
const { pdfBookerHeaders } = require("./model-headers/booker");
const { pdfGiovanniHeaders } = require("./model-headers/giovanni");
const { pdfMandsHeaders } = require("./model-headers/mands");
const { pdfGreggsHeaders } = require("./model-headers/greggs");

const headers = {
  ...pdfIcelandHeaders,
  ...pdfBookerHeaders,
  ...pdfGiovanniHeaders,
  ...pdfMandsHeaders,
  ...pdfGreggsHeaders,
};

module.exports = headers;
