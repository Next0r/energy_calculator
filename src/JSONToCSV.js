const fs = require("fs");
const path = require("path");

const JSONToCSV = (data = [], name = "csvFile", savePath = "") => {
  let header = "";
  for (key in data[0]) {
    if (data[0][key] instanceof Date) {
      header += `date,time,`;
    } else {
      header += `${key},`;
    }
  }
  header = header.slice(0, -1);
  header += "\n";

  let rows = "";
  for (row of data) {
    for (key in row) {
      if (row[key] instanceof Date) {
        rows += `${row[key].toLocaleDateString("en-US")},${row[key].toLocaleTimeString("en-US")},`;
      } else {
        rows += `${row[key]},`;
      }
    }
    rows = rows.slice(0, -1);
    rows += "\n";
  }

  try {
    fs.writeFileSync(path.join(savePath, `${name}.csv`), header + rows);
  } catch (e) {
    throw e;
  }
};

module.exports.JSONToCSV = JSONToCSV;
