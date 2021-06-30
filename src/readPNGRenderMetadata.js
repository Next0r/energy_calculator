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
  const metadataNames = [
    "Date",
    "Time",
    "Frame",
    "FrameRange",
    "RenderTime",
    "Memory",
    "cycles.main.samples",
    "cycles.main.total_time",
    "cycles.main.render_time",
    "cycles.main.synchronization_time",
  ];

  const renderMetadata = {};

  for (name of metadataNames) {
    const index = buffer.search(new RegExp(`tEXt${name}`, "g"));
    const key = name
      .replace(/[A-Z]/, (match) => match[0].toLocaleLowerCase())
      .replace(/[\.|\_][\s\S]/g, (match) => match[1].toUpperCase());

    if (index === -1) {
      renderMetadata[key] = null;
      continue;
    }

    const chunkLengthString = buffer.slice(index - 4, index);
    let length = 0x00000000;

    for (let i = 0; i < chunkLengthString.length; i += 1) {
      length |= chunkLengthString.charCodeAt(i);
      length << 2;
    }

    const data = buffer
      .slice(index + 4, index + 4 + length)
      .split(/\x00/g)
      .pop();

    renderMetadata[key] = data;
  }

  return renderMetadata;
};

module.exports.readPNGRenderMetadata = readPNGRenderMetadata;
