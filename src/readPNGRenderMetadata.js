/**
 * @typedef {Object} RawRenderMetadata
 * @property {string} date
 * @property {string} time
 * @property {string} frame
 * @property {string} frameRange
 * @property {string} renderTime
 * @property {string} memory
 * @property {string} cyclesMainSamples
 * @property {string} cyclesMainTotalTime
 * @property {string} cyclesMainRenderTime
 * @property {string} cyclesMainSynchronizationTime
 */

/**
 * Reads parameters attached by Blender software to image
 * @param {string} buffer
 * @returns {RawRenderMetadata} object that stores metadata as key-value pairs, where value is represented as string or null
 */
const readPNGRenderMetadata = (buffer = "") => {
  const metadataTypes = [
    "tEXtDate",
    "tEXtTime",
    "tEXtFrame",
    "tEXtFrameRange",
    "tEXtRenderTime",
    "tEXtMemory",
    "tEXtcycles.main.samples",
    "tEXtcycles.main.total_time",
    "tEXtcycles.main.render_time",
    "tEXtcycles.main.synchronization_time",
  ];

  const renderMetadata = {};

  for (type of metadataTypes) {
    const regex = new RegExp(`${type}\x00.+?(?=\x00\x00)`, "g");
    const chunk = buffer.match(regex);

    if (chunk) {
      const chunkArray = chunk[0].slice(0, -4).split(/\x00/g);

      renderMetadata[
        `${chunkArray[0]
          .replace(/tEXt[\s\S]/, (match) => {
            return match[match.length - 1].toLowerCase();
          })
          .replace(/[\. | \_][\s\S]/g, (match) => {
            return match[1].toUpperCase();
          })}`
      ] = chunkArray[1];
    } else {
      renderMetadata[
        `${chunkArray[0]
          .replace(/tEXt[\s\S]/, (match) => {
            return match[match.length - 1].toLowerCase();
          })
          .replace(/[\. | \_][\s\S]/g, (match) => {
            return match[1].toUpperCase();
          })}`
      ] = null;
    }
  }

  return renderMetadata;
};

module.exports.readPNGRenderMetadata = readPNGRenderMetadata;
