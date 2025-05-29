import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readFile, writeFile } from "../db/fileHandler";
async function encryptPassword(password) {
  return await bcrypt.hash(password, 10);
}
function comparePassword(password, enPassword) {
  return bcrypt.compareSync(password, enPassword);
}
function generateAccess_RereshToken(username) {
  const accessToken = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ username }, process.env.JWT_REFSECRET, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
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
      categories: [{ id: new Date(), category: "fav" }],
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
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if ([username, password].some((field) => field === "")) {
      return res.status(301).json({ message: "Username/password compulsory" });
    }
    const users = await readFile();
    if (!users.find((user) => user.username === username)) {
      return res.status(404).json({ message: "User not found" });
    }
    const userIndex = users.findIndex((user) => user.username === username);
    if (!comparePassword(password, users[userIndex].password)) {
      return res.status(404).json({ message: "Invalid password" });
    }
    const { accessToken, refreshToken } = generateAccess_RereshToken(username);
    users[userIndex].refreshToken = refreshToken;
    await writeFile(users);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({ message: "User logged in successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong from our side" });
  }
}
async function getUser(req, res) {
  const user = req.user;
  res.status(200).json({ message: "User data fetched successfully", user });
}
async function refreshAccessToken(req, res) {
  try {
    const IrefreshToken = req.cookies?.refreshToken;
    if (!IrefreshToken) {
      return res.status(401).json({ message: "Refresh token is empty" });
    }
    const decodedToken = jwt.verify(IrefreshToken, process.env.JWT_REFSECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const users = await readFile();
    const user = users.findIndex(
      (user) => user.username === decodedToken.username
    );
    if (user == -1 || users[user].refreshToken !== IrefreshToken) {
      return res.status(401).json({ message: "Invalid refresh Token" });
    }
    const { accessToken, refreshToken } = generateAccess_RereshToken(
      users[user].username
    );
    users[user].refreshToken = refreshToken;
    await writeFile(users);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "Token refresh success" });
  } catch (err) {
    return res
      .status(401)
      .json({ message: err.message || "Something went wrong from our side" });
  }
}
async function logout(req, res) {
  return res
    .clearCookie("accessToken", { path: "/" })
    .clearCookie("refreshToken", { path: "/" })
    .end();
}
export { getUser, login, logout, refreshAccessToken, register };
