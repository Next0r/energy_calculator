const path = require("path");
const fs = require("fs");

/**
 * @typedef {Object} Record
 * @property {string} timestamp
 * @property {string} value
 */

/**
 * Finds and returns records from files matching time range (multiple files in range or single file over that range)
 * @param {string} recordsDirectoryPath records directory path
 * @param {number} timeStart beginning of records time range in ms (from 1-1-1970)
 * @param {number} timeEnd end of records time range in ms (from 1-1-1970)
 * @returns set of records from files matching given time range
 */
const getRecordsFromFiles = (recordsDirectoryPath = "", timeStart = 0, timeEnd = 0) => {
  let recordFilesNames;

  try {
    recordFilesNames = fs.readdirSync(recordsDirectoryPath);
  } catch (e) {
    throw e;
  }

  const outRecords = [];

  for (fileName of recordFilesNames) {
    let recordsRaw;

    try {
      recordsRaw = fs.readFileSync(path.join(recordsDirectoryPath, fileName), {
        encoding: "utf8",
        flag: "r",
      });
    } catch (e) {
      throw e;
    }

    /**
     * @type {Record[]}
     */
    const records = JSON.parse(recordsRaw);

    const firstRecTime = new Date(records[0].timestamp).getTime();
    const lastRecTime = new Date(records[records.length - 1].timestamp).getTime();

    if (timeEnd < firstRecTime || timeStart > lastRecTime) {
      continue;
    }

    for (record of records) {
      const recordTime = new Date(record.timestamp).getTime();

      if (recordTime >= timeStart && recordTime <= timeEnd) {
        outRecords.push({ timestamp: new Date(record.timestamp), value: parseFloat(record.value) });
      }
    }
  }

  outRecords.sort((r1, r2) => r1.timestamp.getTime() - r2.timestamp.getTime());

  return outRecords;
};

module.exports.getRecordsFromFiles = getRecordsFromFiles;
