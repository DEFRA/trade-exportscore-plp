function getXsForHeaders(pageContent) {
  const xs = {
    description: bookerDescriptionX(pageContent),
    packages: pageContent.filter(item => item.str === 'No. and')[0]?.x,
    weight: pageContent.filter(item => item.str === 'Net')[0]?.x,
    commodityCode: pageContent.filter(item => item.str === 'Commodity Code')[0]?.x
  }
  //console.log(xs);
  return xs
}

function bookerDescriptionX(pageContent) {
  const descriptionX = pageContent.filter(item => item.str === 'Description')[0].x
  const productCode = pageContent.filter(item => item.str === "Product Code")[0]
  const xRange = productCode.x + productCode.width
  const x = pageContent.filter(item => (item.x > xRange) && (item.x < descriptionX) && (item.str !== '') && (item.y > productCode.y))[0]?.x // look for first x coordiate between end of product code and start of description
  return x
}

function getYsForRows(pageContent) {
  const headerY = pageContent.filter(item => item.str === '(Kilos)')[0]?.y
  const firstY = pageContent.filter(item => item.y > headerY)[0].y // does it still work if extra lines are inserted in the headers?
  //console.log(firstY)
  const pageNumberY = pageContent.filter(item => /Page \d of \d*/.test(item.str))[0]?.y
  const totalsY = pageContent.filter(item => item.str === '0 Boxes')[0]?.y // TODO need to make more secure way of finding 0's row
  const y = findSmaller(pageNumberY, totalsY);
  //console.log(y);
  const lastY = pageContent.filter(item => item.y < y).sort((a, b) => b.y - a.y)[0]?.y;
  const ys = [...new Set(pageContent.filter(item => item.y >= firstY && item.y <= lastY).map(item => item.y))];
  //console.log(ys);
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

module.exports = { getXsForHeaders, getYsForRows };