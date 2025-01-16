const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");

function noRemosParse(_packingList, _filename){
    return combineParser.combine(null, [], false, parserModel.NOREMOS);
}

function unrecognisedParse(_packingList, _filename){
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
}

module.exports = {
    noRemosParse,
    unrecognisedParse
}