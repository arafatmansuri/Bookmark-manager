const fs = require("fs");
export function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/bookmarks.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}
export function writeFile(data) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(__dirname + "/bookmarks.json", JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

