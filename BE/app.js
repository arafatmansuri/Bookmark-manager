const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./src/routes/user.route.js");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  return res.send("Server running fine");
});

module.exports = app;
