import { Router,Response,RequestHandler } from "express";
import {
  getUser,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/user.contoller";
import { verifyJWT } from "../middlewears/user.middlewear";
const userRouter = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(<any>login);
userRouter.route("/getuser").get(<any>verifyJWT, getUser);
userRouter.route("/refreshtoken").post(<any>refreshAccessToken);
userRouter.route("/logout").get(logout);

export default userRouter;
