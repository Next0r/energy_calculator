const path = require("path");
const { parsePNGRenderMetadata } = require("./parsePNGRenderMetadata");
const { readDirectory } = require("./readDirectory");
const { readFile } = require("./readFile");
const { readPNGRenderMetadata } = require("./readPNGRenderMetadata");

const main = async () => {
  const resourceDirectory = path.join(__dirname, "..", "res");

  const files = await readDirectory(resourceDirectory);

  console.log(files);

  const filePath = path.join(resourceDirectory, files[1]);

  const buffer = await readFile(filePath);

  const rawRenderMetadata = readPNGRenderMetadata(buffer);

  const renderMetadata = parsePNGRenderMetadata(rawRenderMetadata);

  console.log(rawRenderMetadata);
};

main();
