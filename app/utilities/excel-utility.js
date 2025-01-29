const excelToJson = require("@boterop/convert-excel-to-json");

function convertExcelToJson(options) {
    let result = excelToJson({
        ...options,
        includeEmptyLines: true,
    });

    for (const sheet of Object.keys(result)) {
        for (let i = 0; i < result[sheet].length; i++) {
          if(result[sheet][i] == null){
            result[sheet][i] = {};
          }
        }
    }

    return result;
}

module.exports = {
  convertExcelToJson
}