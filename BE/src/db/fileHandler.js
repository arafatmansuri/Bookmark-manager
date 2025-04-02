const fs = require("fs");
function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/bookmarks.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}
function writeFile(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + "/bookmarks.json", JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
module.exports = { readFile, writeFile };
