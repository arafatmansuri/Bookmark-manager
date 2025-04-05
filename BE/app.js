const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./src/routes/user.route.js");
const categoryRouter = require("./src/routes/category.route.js");
const bookmarkRouter = require("./src/routes/bookmarks.route.js");
const { verifyJWT } = require("./src/middlewears/user.middlewear.js");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", verifyJWT, categoryRouter);
app.use("/api/v1/bookmark", verifyJWT, bookmarkRouter);
app.get("/", (req, res) => {
  return res.send("Server running fine");
  res.clearCookie()
});

module.exports = app;
