import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import UserModel from "../models/user.model";
import { Handler, IUserDocument } from "../types";

const userInputSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 charachter" })
    .trim(),
  password: z
    .string()
    .regex(/[A-Z]/, {
      message: "Pasword should include atlist 1 uppercase",
    })
    .regex(/[a-z]/, {
      message: "Pasword should include atlist 1 lowercase",
    })
    .regex(/[0-9]/, {
      message: "Pasword should include atlist 1 number",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Pasword should include atlist 1 special charcter",
    })
    .min(8, { message: "Password length shouldn't be less than 8" }),
  email: z.string().email({ message: "invalid email address" }).optional(),
});
type UserInputType = z.infer<typeof userInputSchema>;
const register: Handler = async (req, res): Promise<void> => {
  try {
    const parsedBody = userInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(301).json({
        message:
          parsedBody.error.errors[0].message || "Username/password compulsory",
      });
      return;
    }
    const user: IUserDocument | null =
      await UserModel.findOne<IUserDocument | null>({
        username: parsedBody.data.username,
      });
    if (user) {
      res.status(303).json({ message: "Username/email already exists" });
      return;
    }
    const newUser: IUserDocument = await UserModel.create({
      username: parsedBody.data.username,
      password: parsedBody.data.password,
      email: parsedBody.data.email,
    });
    res
      .status(200)
      .json({ message: "User registred successful", user: newUser });
    return;
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Something went wrong from our side" });
    return;
  }
};
async function login(req: Request, res: Response): Promise<void> {
  try {
    const parsedBody = userInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(301).json({
        message:
          parsedBody.error.errors[0].message || "Username/password compulsory",
      });
      return;
    }
    const user: IUserDocument | null = await UserModel.findOne<IUserDocument>({
      $and: [{ username: parsedBody.data.username }],
    });
    if (!user) {
      res
        .status(404)
        .json({ message: "User not found with this username/email" });
      return;
    }
    if (!user.comparePassword(parsedBody.data.password)) {
      res.status(404).json({ message: "Invalid password" });
      return;
    }
    const { accessToken, refreshToken } = user.generateAccessAndRereshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
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
  const user: IUserDocument = req.user;
  res.status(200).json({ message: "User data fetched successfully", user });
  return;
}
export type TokenType = {
  username: string;
};
async function refreshAccessToken(req: Request, res: Response): Promise<void> {
  try {
    const IrefreshToken: string = req.cookies?.refreshToken;
    if (!IrefreshToken) {
      res.status(401).json({ message: "Refresh token is empty" });
      return;
    }
    const decodedToken: jwt.JwtPayload = jwt.verify(
      IrefreshToken,
      <string>process.env.JWT_REFSECRET
    );
    if (!decodedToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user: IUserDocument | null = await UserModel.findById<IUserDocument>(
      decodedToken._id
    );
    if (!user) {
      res.status(401).json({ message: "Invalid refresh Token" });
      return;
    }
    const { accessToken, refreshToken } = user.generateAccessAndRereshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
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
  } catch (err: any) {
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
