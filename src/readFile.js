const fs = require("fs");

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "latin1", flag: "r" }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports.readFile = readFile;
