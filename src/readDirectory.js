const fs = require("fs");

const readDirectory = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
};

module.exports.readDirectory = readDirectory;
