
const fs = require("fs");
export interface Schema {
  userId: Date;
  username: string;
  password: string;
  bookmarks?: [
    {
      bId?: Date;
      url?: string;
      category?: string;
      fav?: boolean;
      createdAt?: Date;
    }
  ];
  categories?: [
    {
      id: Date;
      category: string;
    }
  ];
  refreshToken?: string;
}
export function readFile<T>(): Promise<T>{
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/bookmarks.json", "utf-8",(err, data)  => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data))
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
