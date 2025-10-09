const fs = require("fs");
const path = require("node:path");
const { Readable } = require("node:stream");
const { convertCsvToJson } = require("../../../app/utilities/csv-utility");

describe("csv-utility", () => {
  test("parses CSV from Buffer", async () => {
    const buf = Buffer.from("h1,h2\n1,2\n3,4");
    const res = await convertCsvToJson(buf);
    expect(res).toEqual([
      ["h1", "h2"],
      ["1", "2"],
      ["3", "4"],
    ]);
  });

  test("parses CSV from Readable stream", async () => {
    const buf = Buffer.from("a,b,c\n5,6,7");
    const stream = Readable.from([buf]);
    const res = await convertCsvToJson(stream);
    expect(res).toEqual([
      ["a", "b", "c"],
      ["5", "6", "7"],
    ]);
  });

  test("parses CSV from filename", async () => {
    const tmpDir = path.join(process.cwd(), "test-output");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const tmpFile = path.join(tmpDir, "tmp-csv-utility.csv");
    fs.writeFileSync(tmpFile, "x,y\n8,9");

    const res = await convertCsvToJson(tmpFile);
    expect(res).toEqual([
      ["x", "y"],
      ["8", "9"],
    ]);

    // cleanup
    try {
      fs.unlinkSync(tmpFile);
    } catch (e) {}
  });
});
