import { Schema } from "../types";

const fs = require("fs");
export function readFile(): Promise<Schema[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/bookmarks.json", "utf-8", (err: Error, data:string) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}
export function writeFile(data: Schema[]) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(
      __dirname + "/bookmarks.json",
      JSON.stringify(data),
      (err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
}
