import jwt from "jsonwebtoken";
import { TokenType } from "../controllers/user.contoller";
import { readFile, Schema } from "../db/fileHandler";

async function verifyJWT(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const users: Schema[] = await readFile();
    const userIndex = users.findIndex(
      (user) => user.username === (decodedToken as TokenType).username
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
