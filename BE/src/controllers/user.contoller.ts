import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { readFile, writeFile } from "../db/fileHandler";
import { Handler, Schema } from "../types";
async function encryptPassword(password) {
  return await bcrypt.hash(password, 10);
}
function comparePassword(password: string, enPassword: string): boolean {
  return bcrypt.compareSync(password, enPassword);
}
function generateAccess_RereshToken(username: string): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken: string = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken: string = jwt.sign(
    { username },
    process.env.JWT_REFSECRET,
    {
      expiresIn: "1d",
    }
  );
  return { accessToken, refreshToken };
}
const register: Handler = async (req, res): Promise<void> => {
  try {
    const { username, password } = req.body;
    if ([username, password].some((field) => field === "")) {
      res.status(301).json({ message: "Username/password compulsory" });
      return;
    }
    const users: Schema[] = await readFile();
    if (users.find((user) => user.username === username)) {
      res.status(303).json({ message: "Username already exists" });
      return;
    }
    const hashedPassword = await encryptPassword(password);
    const newUser: Schema = {
      userId: new Date(),
      username: username,
      password: hashedPassword,
      bookmarks: [{}],
      categories: [{ id: Number(new Date()), category: "fav" }],
    };
    users.push(newUser);
    await writeFile(users);
    res.status(200).json({ message: "User registred successfull", newUser });
    return;
  } catch (err) {
    res.status(500).json({ message: "Something went wrong from our side" });
    return;
  }
};
async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    if ([username, password].some((field) => field === "")) {
      res.status(301).json({ message: "Username/password compulsory" });
      return;
    }
    const users: Schema[] = await readFile();
    if (!users.find((user) => user.username === username)) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userIndex = users.findIndex((user) => user.username === username);
    if (!comparePassword(password, users[userIndex].password)) {
      res.status(404).json({ message: "Invalid password" });
      return;
    }
    const { accessToken, refreshToken } = generateAccess_RereshToken(username);
    users[userIndex].refreshToken = refreshToken;
    await writeFile(users);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: <"none">"none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({ message: "User logged in successfully" });
    return;
  } catch (err) {
    res.status(500).json({ message: "Something went wrong from our side" });
    return;
  }
}
async function getUser(req: Request, res: Response): Promise<void> {
  const user = req.user;
  res.status(200).json({ message: "User data fetched successfully", user });
  return;
}
export type TokenType = {
  username: string;
};
async function refreshAccessToken(req: Request, res: Response): Promise<void> {
  try {
    const IrefreshToken = req.cookies?.refreshToken;
    if (!IrefreshToken) {
      res.status(401).json({ message: "Refresh token is empty" });
      return;
    }
    const decodedToken = jwt.verify(IrefreshToken, process.env.JWT_REFSECRET);
    if (!decodedToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const users: Schema[] = await readFile();
    const user = users.findIndex(
      (user) => user.username === (decodedToken as TokenType).username
    );
    if (user == -1 || users[user].refreshToken !== IrefreshToken) {
      res.status(401).json({ message: "Invalid refresh Token" });
      return;
    }
    const { accessToken, refreshToken } = generateAccess_RereshToken(
      users[user].username
    );
    users[user].refreshToken = refreshToken;
    await writeFile(users);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: <"none">"none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "Token refresh success" });
    return;
  } catch (err) {
    res
      .status(401)
      .json({ message: err.message || "Something went wrong from our side" });
    return;
  }
}
function logout(req: Request, res: Response): void {
  res
    .clearCookie("accessToken", { path: "/" })
    .clearCookie("refreshToken", { path: "/" })
    .end();
  return;
}
export { getUser, login, logout, refreshAccessToken, register };
