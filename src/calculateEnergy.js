/**
 * Calculates energy for given time range
 * @param {[*]} records array of records (objects containing timestamp and value properties)
 * @param {number} timeStart beginning of time range for energy calculation (in ms from 1-1-1970)
 * @param {number} timeEnd end of time range for energy calculation (in ms from 1-1-1970)
 * @returns {number} energy in Wh
 */
const calculateEnergy = (records = [], timeStart = 0, timeEnd = 0) => {
  let lastRecordTime = null;
  let energy = 0;

  for (let i = 0; i < records.length; i += 1) {
    const recordTime = new Date(records[i].timestamp).getTime();

    if (recordTime > timeEnd) {
      let interval = timeEnd - lastRecordTime;

      energy += records[i].value * interval * 0.001;
      break;
    }

    if (recordTime > timeStart) {
      let interval = recordTime - timeStart;

      if (lastRecordTime) {
        interval = recordTime - lastRecordTime;
      }

      lastRecordTime = recordTime;

      energy += records[i].value * interval * 0.001;
    }
  }

  return energy / 3600;
};

module.exports.calculateEnergy = calculateEnergy;
