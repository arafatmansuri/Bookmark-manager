import jwt from "jsonwebtoken";
import { readFile } from "../db/fileHandler";

async function verifyJWT(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const users = await readFile();
    const userIndex = users.findIndex(
      (user) => user.username === decodedToken.username
    );
    if (userIndex == -1) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.users = users;
    req.user = users[userIndex];
    req.userIndex = userIndex;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: err.message || "Something went wrong from our side" });
  }
}
export { verifyJWT };
