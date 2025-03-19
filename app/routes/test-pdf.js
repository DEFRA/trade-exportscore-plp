const fs = require('fs');
const PDFParser = require('pdf2json');
const config = require("../config");

const { PdfDocument } = require('@pomgui/pdf-tables-parser')
var pdfreader = require("pdfreader");

 
async function extractTablesFromPDF(pdfPath) {
  const parser = new PDFParser();
  return new Promise((resolve, reject) => {
    parser.on('pdfParser_dataError', err => reject(err));
    parser.on('pdfParser_dataReady', pdfData => {
      const tables = processPDFData(pdfData);
      resolve(tables);
    });
    parser.loadPDF(pdfPath);
  });
}

function processPDFData(pdfData) {
  const pages = pdfData.Pages;
  const allTables = [];
  pages.forEach((page, pageIndex) => {
    const textBlocks = extractTextBlocks(page);
    //console.log(textBlocks)
    const tables = detectTables(textBlocks, pageIndex, pages.length);
    //console.log(tables);
    allTables.push(...tables);
  });
  return stitchTables(allTables);
}

 
function extractTextBlocks(page) {
  const texts = page.Texts.map(t => ({
    x: t.x,
    y: t.y,
    text: decodeURIComponent(t.R[0].T),
  }));
  // Sort by y (top to bottom), then x (left to right)
  return texts.sort((a, b) => a.y - b.y || a.x - b.x);
}

 
function detectTables(textBlocks, pageIndex, totalPages) {
  console.log(textBlocks)
  const tables = [];
  let currentTable = [];
  let prevY = 217;
  let columnBoundaries = null;
 
  textBlocks.forEach(block => {
    const { x, y, text } = block;
    // Detect row start based on significant y-gap (heuristic)
    if (prevY === null || Math.abs(y - prevY) > 5) {
      if (currentTable.length > 0) {
        tables.push(currentTable);
        currentTable = [];
      }
      prevY = y;
      //console.log(prevY)
    }

    // Initialize column boundaries from the first row
    if (!columnBoundaries && currentTable.length === 0) {
      columnBoundaries = detectColumns(textBlocks.filter(b => Math.abs(b.y - y) < 1));
    }

    // Assign text to a column
    const columnIndex = columnBoundaries.findIndex((boundary, i) =>
      x >= boundary && (i === columnBoundaries.length - 1 || x < columnBoundaries[i + 1])
    );

    if (columnIndex >= 0) {
      if (!currentTable[currentTable.length - 1]) currentTable.push([]);
      while (currentTable[currentTable.length - 1].length <= columnIndex) {
        currentTable[currentTable.length - 1].push('');
      }
      currentTable[currentTable.length - 1][columnIndex] += text + ' ';
    }
  });

  if (currentTable.length > 0) tables.push(currentTable);
  return tables;
}

 

function detectColumns(rowBlocks) {
  // Heuristic: Use x-positions to infer column boundaries
  const xPositions = rowBlocks.map(b => b.x).sort((a, b) => a - b);
  const boundaries = [];
  for (let i = 0; i < xPositions.length - 1; i++) {
    if (xPositions[i + 1] - xPositions[i] > 10) { // Adjust gap threshold as needed
      boundaries.push(xPositions[i]);
    }
  }
  boundaries.push(xPositions[xPositions.length - 1]);
  //console.log(boundaries)
  return boundaries;
}


function stitchTables(tables) {
  // Combine tables and handle multi-page rows or wrapped cells
  const result = [];
  let bufferRow = null;

  tables.forEach(table => {
    table.forEach(row => {
      // Heuristic: If row has fewer columns than expected, it might be a continuation
      if (bufferRow && row.length < bufferRow.length) {
        bufferRow = bufferRow.map((cell, i) => (row[i] ? cell + ' ' + row[i] : cell));
      } else {
        if (bufferRow) result.push(bufferRow);
        bufferRow = row;
      }
    });
  });

  if (bufferRow) result.push(bufferRow);
  return result;

}





 
module.exports = {
  method: "GET",
  path: "/test-pdf",
  handler: async (_request, h) => {
    // try {
       const pdfPath = config.plDir + _request.query.filename;
    //   const pdf = new PdfDocument();
    //   await pdf.load(pdfPath);
    //   return h.response(pdf);
    // } catch (err) {
    //   console.error(err);
    //   return h.response('Error loading PDF').code(500);
    // }

    const nbCols = 6;
    const cellPadding = 30; // each cell is padded to fit 40 characters
    const columnQuantitizer = (item) => parseFloat(item.x) >= 30;

    const padColumns = (array, nb) =>
      Array.apply(null, { length: nb }).map((val, i) => array[i] || []);
    // .. because map() skips undefined elements

    const mergeCells = (cells) =>
      (cells || [])
        .map((cell) => cell.text)
        .join("") // merge cells
        .substr(0, cellPadding)
        .padEnd(cellPadding, " "); // padding

    const renderMatrix = (matrix) =>
      (matrix || [])
        .map((row, y) => padColumns(row, nbCols).map(mergeCells).join(" | "))
        .join("\n");

    var table = new pdfreader.TableParser();
    
    // let result
    // new pdfreader.PdfReader().parseFileItems(pdfPath, function (err, item) {
    //   if (err) {
    //     console.log(err)
    //   }
    //   else if (!item) {
    //     console.log("end of file")
    //   }
    //   else {
    //     result = item.text
    //     table.processItem(item, columnQuantitizer(item));
    //     console.log(item.text)
    //     console.log(renderMatrix(table.getMatrix()))
    //   }
    // });

    new pdfreader.PdfReader().parseFileItems(pdfPath, function (err, item) {
      if (!item || item.page) {
        // end of file, or page
        console.log(renderMatrix(table.getMatrix()));
        console.log("PAGE:", item);
        table = new pdfreader.TableParser(); // new/clear table for next page
      } else if (item.text) {
        // accumulate text items into rows object, per line
        table.processItem(item, columnQuantitizer(item));
      }
    });

    return h.response("result").code(200);
  },
};


 