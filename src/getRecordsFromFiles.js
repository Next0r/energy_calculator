const path = require("path");
const { parseRecordFileName } = require("./parseRecordFileName");
const { readDirectory } = require("./readDirectory");
const { readFile } = require("./readFile");

/**
 * Finds and returns records from files matching time range (multiple files in range or single file over that range)
 * @param {string} recordsDirectoryPath records directory path
 * @param {number} timeStart beginning of records time range in ms (from 1-1-1970)
 * @param {number} timeEnd end of records time range in ms (from 1-1-1970)
 * @returns set of records from files matching given time range
 */
const getRecordsFromFiles = async (
  recordsDirectoryPath = "",
  timeStart = 0,
  timeEnd = 0
) => {
  const recordFilesNames = await readDirectory(recordsDirectoryPath);
  const fileNames = [];

  for (fileName of recordFilesNames) {
    const recordTime = parseRecordFileName(fileName).getTime();

    if (recordTime > timeStart) {
      fileNames.push(fileName);

      if (recordTime > timeEnd) {
        break;
      }
    }
  }

  const records = [];

  for (fileName of fileNames) {
    const filePath = path.join(recordsDirectoryPath, fileName);
    let data = await readFile(filePath);
    data = JSON.parse(data);

    records.push(...data);
  }

  return records;
};

module.exports.getRecordsFromFiles = getRecordsFromFiles;
