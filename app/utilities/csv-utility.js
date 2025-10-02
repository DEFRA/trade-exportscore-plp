const { parse } = require("csv-parse");
const fs = require("node:fs");

async function convertCsvToJson(bufferOrFilename) {
  const parser = fs.createReadStream(bufferOrFilename).pipe(
    parse({
      columns: false,
      skip_empty_lines: true,
      trim: true,
      bom: true, // strip BOM if present
    }),
  );

  const replaceEmptyStringWithNull = (field) => (field === "" ? null : field);

  const results = [];
  for await (const record of parser) {
    results.push(record.map(replaceEmptyStringWithNull));
  }

  return results;
}

module.exports = {
  convertCsvToJson,
};
