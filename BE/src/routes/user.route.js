const { Router } = require("express");
const {
  register,
  login,
  getUser,
} = require("../controllers/user.contoller.js");
const { verifyJWT } = require("../middlewears/user.middlewear.js");

const userRouter = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/getuser").get(verifyJWT, getUser);

module.exports = userRouter;
