function noRemosMatch(sanitisedPackingList, _filename) {
    const remosRegex = /RMS-GB-(\d{6})(-\d{3})?/i;
    const sheets = Object.keys(sanitisedPackingList);
    for (const sheet of sheets) {
        const isRemosPresent = sanitisedPackingList[sheet].some((x) => {
            return remosRegex.test(Object.values(x));
        });
        if (isRemosPresent) return true;
    }
    return false;
}

module.exports = { noRemosMatch }