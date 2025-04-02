const { readFile, writeFile } = require("../db/fileHandler.js");
const bcrypt = require("bcrypt");
async function encryptPassword(password) {
  return await bcrypt.hash(password, 10);
}
async function comparePassword(password, enPassword) {
  return await bcrypt.compare(password, enPassword);
}
async function register(req, res) {
  try {
    const { username, password } = req.body;
    if ([username, password].some((field) => field === "")) {
      return res.status(301).json({ message: "Username/password compulsory" });
    }
    const users = await readFile();
    if (users.find((user) => user.username === username)) {
      return res.status(303).json({ message: "Username already exists" });
    }
    const hashedPassword = await encryptPassword(password);
    const newUser = {
      userId: new Date(),
      username: username,
      password: hashedPassword,
      bookmarks: [],
      categories: ["fav"],
    };
    users.push(newUser);
    await writeFile(users);
    return res
      .status(200)
      .json({ message: "User registred successfull", newUser });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong from our side" });
  }
}
module.exports = { register };
