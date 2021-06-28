/**
 * Turns record file name into date and time object
 * @param {string} fileName name of record file
 * @returns {Date} time and date represented by file name
 */
const parseRecordFileName = (fileName = "") => {
  let fileNameArray = fileName.split(".")[0].split("_");

  if (fileNameArray.length !== 8) {
    return null;
  }

  fileNameArray = fileNameArray.slice(2);

  const date = new Date(
    +fileNameArray[2],
    +fileNameArray[1] - 1,
    +fileNameArray[0],
    +fileNameArray[3],
    +fileNameArray[4],
    +fileNameArray[5]
  );

  return date;
};

module.exports.parseRecordFileName = parseRecordFileName;
