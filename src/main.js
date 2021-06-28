const path = require("path");
const { calculateEnergy } = require("./calculateEnergy");
const { getRecordsFromFiles } = require("./getRecordsFromFiles");
const { parsePNGRenderMetadata } = require("./parsePNGRenderMetadata");
const { readDirectory } = require("./readDirectory");
const { readFile } = require("./readFile");
const { readPNGRenderMetadata } = require("./readPNGRenderMetadata");

/**
 * Calculates energy for all images in specified directory
 * @param {string} imagesDirPath path to rendered images directory
 * @param {string} recordsDirPath path to power records directory
 * @returns array of metadata (object) and energy (number) for each image in images directory
 */
const calculateEnergyForImages = async (
  imagesDirPath = "",
  recordsDirPath = ""
) => {
  const imagesNames = await readDirectory(imagesDirPath);

  const results = [];

  for (imageName of imagesNames) {
    const imageDataBuffer = await readFile(path.join(imagesDirPath, imageName));
    const rawRenderMetadata = readPNGRenderMetadata(imageDataBuffer);
    const renderMetadata = parsePNGRenderMetadata(rawRenderMetadata);

    const renderStartTime =
      renderMetadata.date.getTime() - renderMetadata.cyclesMainRenderTime;
    const renderEndTime = renderMetadata.date.getTime();

    const records = await getRecordsFromFiles(
      recordsDirPath,
      renderStartTime,
      renderEndTime
    );

    const energy = calculateEnergy(records, renderStartTime, renderEndTime);

    results.push({ renderMetadata: renderMetadata, renderEnergy: energy });
  }

  return results;
};

const main = async () => {
  const imagesDirPath = path.join(__dirname, "..", "res", "images");
  const recordsDirPath = path.join(__dirname, "..", "res", "records");

  const renderingEnergy = await calculateEnergyForImages(
    imagesDirPath,
    recordsDirPath
  );

  console.log(renderingEnergy);
  console.log();
};

main();
