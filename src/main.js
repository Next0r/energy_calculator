const path = require("path");
const { calculateEnergy } = require("./calculateEnergy");
const { getRecordsFromFiles } = require("./getRecordsFromFiles");
const { parsePNGRenderMetadata } = require("./parsePNGRenderMetadata");
const { parseRecordFileName } = require("./parseRecordFileName");
const { readDirectory } = require("./readDirectory");
const { readFile } = require("./readFile");
const { readPNGRenderMetadata } = require("./readPNGRenderMetadata");

const main = async () => {
  const resourceDirectory = path.join(__dirname, "..", "res", "images");

  const files = await readDirectory(resourceDirectory);

  console.log(files);

  const filePath = path.join(resourceDirectory, files[2]);

  const buffer = await readFile(filePath);

  const rawRenderMetadata = readPNGRenderMetadata(buffer);

  const renderMetadata = parsePNGRenderMetadata(rawRenderMetadata);

  const recordsFilesDirPath = path.join(__dirname, "..", "res", "records");

  // const date = parseRecordFileName(recordsFiles[0]);

  let time = renderMetadata.date.getTime();
  time -= renderMetadata.cyclesMainRenderTime;

  // const dateStart = new Date(time);
  // const dateEnd = renderMetadata.date;

  const timeStart = time;
  const timeEnd = renderMetadata.date.getTime();

  const records = await getRecordsFromFiles(
    recordsFilesDirPath,
    timeStart,
    timeEnd
  );

  const energy = calculateEnergy(records, timeStart, timeEnd);

  console.log(energy);
};

main();
