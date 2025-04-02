const { Router } = require("express");
const { register } = require("../controllers/user.contoller.js");

const userRouter = Router();

userRouter.route("/register").post(register);

module.exports = userRouter;
