/**
 * Changes string values to more representative objects e.g. string date to Date,
 * numeric time values should be interpreted as milliseconds
 * @param {import("./readPNGRenderMetadata").RawRenderMetadata} rawRenderMetadata
 */
const parsePNGRenderMetadata = (rawRenderMetadata) => {
  const renderMetadata = {
    date: new Date(rawRenderMetadata.date),
    time: new Date(1970, 0, 1, 0, 0, 0, 0),
    frame: +rawRenderMetadata.frame,
    frameStart: +rawRenderMetadata.frameRange.split(":")[0],
    frameEnd: +rawRenderMetadata.frameRange.split(":")[1],
    renderTime: 0,
    memory: +rawRenderMetadata.memory.slice(0, -1),
    cyclesMainSamples: +rawRenderMetadata.cyclesMainSamples,
    cyclesMainTotalTime: 0,
    cyclesMainRenderTime: 0,
    cyclesMainSynchronizationTime: 0,
  };

  if (renderMetadata.time !== null) {
    let timeArray = rawRenderMetadata.time.split(":");
    renderMetadata.time.setHours(timeArray[0]);
    renderMetadata.time.setMinutes(timeArray[1]);
    renderMetadata.time.setSeconds(timeArray[2]);
    renderMetadata.time.setMilliseconds(timeArray[3]);
  }

  const properties = [
    "renderTime",
    "cyclesMainTotalTime",
    "cyclesMainRenderTime",
    "cyclesMainSynchronizationTime",
  ];

  for (property of properties) {
    if (property !== null) {
      timeArray = rawRenderMetadata[property].split(/[:|\.]/g);
      renderMetadata[property] =
        ((+timeArray[0] * 60 + +timeArray[1]) * 100 + +timeArray[2]) * 10;
    }
  }

  return renderMetadata;
};

module.exports.parsePNGRenderMetadata = parsePNGRenderMetadata;
