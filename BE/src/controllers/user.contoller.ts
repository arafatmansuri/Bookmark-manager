import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "../../generated/prisma";
import { Handler } from "../types";
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async $allOperations({ operation, args, query }) {
        if (["create", "update"].includes(operation) && args.data?.password) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
    },
  },
  result: {
    user: {
      generateAccessAndRereshToken: {
        needs: { username: true, id: true },
        compute(user) {
          return () => {
            const accessToken = jwt.sign(
              { username: user.username, _id: user.id },
              <string>process.env.JWT_SECRET,
              {
                expiresIn: "15m",
              }
            );
            const refreshToken = jwt.sign(
              { username: user.username, _id: user.id },
              <string>process.env.JWT_REFSECRET,
              {
                expiresIn: "1d",
              }
            );
            return { accessToken, refreshToken };
          };
        },
      },
      comparePassword: {
        needs: { password: true },
        compute(user) {
          return async (inputPassword: string) =>
            await bcrypt.compare(inputPassword, user.password);
        },
      },
    },
  },
});

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
  email: z.string().email({ message: "invalid email address" }),
});
const loginInputSchema = userInputSchema.pick({
  password: true,
  username: true,
});
type UserInputType = z.infer<typeof userInputSchema>;
const register: Handler = async (req, res): Promise<void> => {
  try {
    const parsedBody = userInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(403).json({
        message:
          parsedBody.error.issues[0].message ||
          "Username/password compulsory",
      });
      return;
    }
    const user = await prisma.user.findFirst({
      where: {
        username: parsedBody.data.username,
      },
    });
    if (user) {
      res.status(404).json({ message: "Username/email already exists" });
      return;
    }
    const newUser = await prisma.user.create({
      data: {
        username: parsedBody.data.username,
        password: parsedBody.data.password,
        email: parsedBody.data.email,
        Category: {
          create: {
            category: "General",
          },
        },
      },
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
    const parsedBody = loginInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(403).json({
        message:
          parsedBody.error.issues[0].message || "Username/password compulsory",
      });
      return;
    }
    const user = await prisma.user.findFirst({
      where: {
        username: parsedBody.data.username,
      },
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
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
    });
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
  const userId = req.user?.id;
  const user = await prisma.user.findFirst({ where: { id: userId } });
  res
    .status(200)
    .json({ message: "User data fetched successfully", user: user });
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
    const user = await prisma.user.findFirst({
      where: { id: decodedToken._id },
    });
    if (!user) {
      res.status(401).json({ message: "Invalid refresh Token" });
      return;
    }
    const { accessToken } = user.generateAccessAndRereshToken();
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
