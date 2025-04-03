const jwt = require("jsonwebtoken");
const { readFile } = require("../db/fileHandler.js");

async function verifyJWT(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const users = await readFile();
    const user = users.find((user) => user.username === decodedToken.username);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong from our side" });
  }
}
module.exports = { verifyJWT };
