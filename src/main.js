const path = require("path");
const { calculateEnergy } = require("./calculateEnergy");
const { getRecordsFromFiles } = require("./getRecordsFromFiles");
const { parsePNGRenderMetadata } = require("./parsePNGRenderMetadata");
const { readPNGRenderMetadata } = require("./readPNGRenderMetadata");
const fs = require("fs");

/**
 * Calculates energy for all images in specified directory
 * @param {string} imagesDirPath path to rendered images directory
 * @param {string} recordsDirPath path to power records directory
 * @returns array of metadata (object) and energy (number) for each image in images directory
 */
const calculateEnergyForImages = (imagesDirPath = "", recordsDirPath = "") => {
  let imageNames;

  try {
    imagesNames = fs.readdirSync(imagesDirPath);
  } catch (e) {
    throw e;
  }

  const results = [];

  try {
    for (imageName of imagesNames) {
      const imageDataBuffer = fs.readFileSync(path.join(imagesDirPath, imageName), {
        encoding: "utf8",
        flag: "r",
      });

      const rawRenderMetadata = readPNGRenderMetadata(imageDataBuffer);
      const renderMetadata = parsePNGRenderMetadata(rawRenderMetadata);

      const renderStartTime = renderMetadata.date.getTime() - renderMetadata.cyclesMainRenderTime;
      const renderEndTime = renderMetadata.date.getTime();

      const records = getRecordsFromFiles(recordsDirPath, renderStartTime, renderEndTime);

      const energy = calculateEnergy(records, renderStartTime, renderEndTime);

      results.push({ renderMetadata: renderMetadata, renderEnergy: energy });
    }
  } catch (e) {
    throw e;
  }

  return results;
};

const main = () => {
  const imagesDirPath = path.join(__dirname, "..", "res", "images");
  const recordsDirPath = path.join(__dirname, "..", "res", "records");

  let renderingEnergy;

  try {
    renderingEnergy = calculateEnergyForImages(imagesDirPath, recordsDirPath);
  } catch (e) {
    console.warn(e.stack);
    return;
  }

  console.log(renderingEnergy);
  console.log();
};

main();
