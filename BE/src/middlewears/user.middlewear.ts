import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import { IUserDocument } from "../types";
async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token: string = req.cookies?.accessToken;
    if (!token) {
      res.status(401).json({ message: "Token not found" });
      return;
    }
    const decodedToken = jwt.verify(token, <string>process.env.JWT_SECRET);
    const user: IUserDocument | null = await UserModel.findById<IUserDocument>(
      decodedToken._id
    );
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    req.user = user;
    next();
    return;
  } catch (err: any) {
    res
      .status(401)
      .json({ message: err.message || "Something went wrong from our side" });
    return;
  }
}
export { verifyJWT };
