const { parse } = require("csv-parse");
const fs = require("node:fs");

async function convertCsvToJson(buffer) {
  const parser = fs.createReadStream(buffer).pipe(
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

module.exports = {
  convertCsvToJson,
};
