const headers = require('../services/model-headers')

function getXsForRows(pageContent, model) {
  const header = headers[model].headers;
  const xs = {
    description: findRowXFromHeaderAndTextAlignment(pageContent, header.description),
    packages: findRowXFromHeaderAndTextAlignment(pageContent, header.number_of_packages),
    weight: findRowXFromHeaderAndTextAlignment(pageContent, header.total_net_weight),
    commodityCode: findRowXFromHeaderAndTextAlignment(pageContent, header.commodity_code),
    treatmentType: findRowXFromHeaderAndTextAlignment(pageContent, header.type_of_treatment),
    countryOfOrigin: findRowXFromHeaderAndTextAlignment(pageContent, header.country_of_origin),
    natureOfProducts: findRowXFromHeaderAndTextAlignment(pageContent, header.nature_of_products),
  }
  //console.log(xs)
  return xs
}

function findRowXFromHeaderAndTextAlignment(pageContent, header) {
  let x;
  switch (header?.headerTextAlignment) {
    case ('LL'):
      x = pageContent.filter(item => header.regex.test(item.str))[0]?.x ?? null;
      break;
    case ('CL'):
      const headerPosition = pageContent.filter(item => header.regex.test(item.str))[0]
      const previousXs = pageContent.filter(item => (item.y > headerPosition.y) && (item.x < headerPosition.x) && (item.str.trim() !== ''));
      x = previousXs.reduce((max, obj) => (obj.x > max ? obj.x : max), previousXs[0].x);
      break;
    default:
      x = null;
  }
  return x;
}

function getYsForRows(pageContent, model) {
  const headerY = pageContent.filter(item => headers[model].maxHeadersY.test(item.str))[0]?.y
  const firstY = pageContent.filter(item => item.y > headerY)[0].y
  const pageNumberY = pageContent.filter(item => /Page \d of \d*/.test(item.str))[0]?.y // find the position of the 'Page X of Y' 
  const totals = pageContent.filter(item => headers[model].totals.test(item.str)) // find the position of the totals row
  const totalsY = totals.reduce((max, obj) => (obj.y > max ? obj.y : max), totals[0]?.y); // take the largest y
  const y = findSmaller(pageNumberY, totalsY);
  const lastY = pageContent.filter(item => item.y < y).sort((a, b) => b.y - a.y)[0]?.y;
  const ys = [...new Set(pageContent.filter(item => item.y >= firstY && item.y <= lastY).map(item => item.y))];
  return ys
}

function findSmaller(a, b) {
  if (a === undefined && b === undefined) {
      return undefined; 
  } else if (a === undefined) {
      return b; 
  } else if (b === undefined) {
      return a; 
  } else {
      return Math.min(a, b); 
  }
}

function getHeaders(pageContent, model) {
  const y1 = pageContent.filter(item => headers[model].minHeadersY.test(item.str))[0]?.y;
  const y2 = pageContent.filter(item => headers[model].maxHeadersY.test(item.str))[0]?.y;
  const header = pageContent.filter(item => (item.y >= y1) && (item.y <= y2) && (item.str.trim() !== ''))

  const groupedByX = header.reduce((acc, obj) => {
    if (!acc[obj.x]) {
      acc[obj.x] = [];
    }
    acc[obj.x].push(obj.str);
    return acc;
  }, {});
  
  const result = Object.values(groupedByX);
  const joinedArray = result.map(x => x.join(' '));

  return joinedArray;
}

module.exports = { getXsForRows, getYsForRows, getHeaders };