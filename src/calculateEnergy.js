/**
 * @typedef {Object} PowerRecord
 * @property {Date} timestamp
 * @property {Number} value
 */

/**
 * @typedef {Object} CalculateEnergyReturn
 * @property {number} energy
 * @property {number} averagePower
 */

/**
 * Calculates energy for given time range
 * @param {PowerRecord[]} records array of records (objects containing timestamp and value properties)
 * @param {number} timeStart beginning of time range for energy calculation (in ms from 1-1-1970)
 * @param {number} timeEnd end of time range for energy calculation (in ms from 1-1-1970)
 * @returns {CalculateEnergyReturn} energy in Wh and average power in W
 */
const calculateEnergy = (records = [], timeStart = 0, timeEnd = 0) => {
  let energy = 0;

  if (records.length === 0) {
    return 0;
  }

  let n = 0;
  let totalPower = 0;

  const firstInterval = records[0].timestamp.getTime() - timeStart;
  energy += records[0].value * firstInterval * 0.001;
  n += 1;
  totalPower += records[0].value;

  for (let i = 1; i < records.length; i += 1) {
    const lastRecordTime = records[i - 1].timestamp.getTime();
    const recordTime = records[i].timestamp.getTime();

    const interval = recordTime - lastRecordTime;

    energy += records[i].value * interval * 0.001;
    n += 1;
    totalPower += records[i].value;
  }

  const lastInterval = timeEnd - records[records.length - 1].timestamp.getTime();
  energy += records[records.length - 1].value * lastInterval * 0.001;
  n += 1;
  totalPower += records[records.length - 1].value

  return {
    energy: energy / 3600, // convert from Ws to Wh
    averagePower: totalPower / n,
  };
};

module.exports.calculateEnergy = calculateEnergy;
