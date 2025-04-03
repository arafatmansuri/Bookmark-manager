const { Router } = require("express");
const { register, login } = require("../controllers/user.contoller.js");

const userRouter = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);

module.exports = userRouter;
