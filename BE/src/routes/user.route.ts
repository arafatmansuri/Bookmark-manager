import { Router,Response,RequestHandler } from "express";
import {
  getUser,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/user.contoller";
import { verifyJWT } from "../middlewears/user.middlewear";
const userRouter: Router = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/getuser").get(verifyJWT, getUser);
userRouter.route("/refreshtoken").post(refreshAccessToken);
userRouter.route("/logout").get(verifyJWT, logout);

export default userRouter;
