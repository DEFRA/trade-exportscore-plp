const { parse } = require("csv-parse");
const fs = require("node:fs");
const { Readable } = require("stream");

async function convertCsvToJson(bufferOrFilename) {
  // Accept a Buffer, a Readable stream, or a filename string
  const parser = createInputStream(bufferOrFilename).pipe(
    parse({
      columns: false,
      skip_empty_lines: true,
      trim: true,
      bom: true, // strip BOM if present
    }),
  );

  const results = [];
  for await (const record of parser) {
    results.push(record);
  }

  return results;
}

function createInputStream(bufferOrFilename) {
  if (Buffer.isBuffer(bufferOrFilename)) {
    return Readable.from([bufferOrFilename]);
  } else if (
    bufferOrFilename && typeof bufferOrFilename === "object" &&
    typeof bufferOrFilename.pipe === "function"
  ) {
    // Already a stream
    return bufferOrFilename;
  } else {
    // Assume a filename/path
    return fs.createReadStream(bufferOrFilename);
  }
}

module.exports = {
  convertCsvToJson,
};
