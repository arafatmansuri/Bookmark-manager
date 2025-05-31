import { RequestHandler as Middleware, Request, Response } from "express";
import { Schema,Document } from "mongoose";
/*
Old Schema as per fs database
export interface Schema {
  userId: Date;
  username: string;
  password: string;
  bookmarks: [
    {
      id?: number;
      url?: string;
      category?: string;
      fav?: boolean;
      createdAt?: Date;
    }
  ];
  categories: [
    {
      id: number;
      category: string;
    }
  ];
  refreshToken?: string;
}
export type CategoryType = Pick<Schema, "categories">["categories"][0];
export type BookmarkType = Pick<Schema, "bookmarks">["bookmarks"][0];*/
type Method =
  | "get"
  | "head"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "options"
  | "trace"
  | "patch";

export type Handler = (req: Request, res: Response) => any;
export type Route = {
  method: Method;
  path: string;
  middleware: Middleware[];
  handler: Handler;
};

export interface IUser {
  username: string;
  password: string;
  email: string;
  refreshToken?: string;
}
export interface IUserDocument extends IUser,Document {
  comparePassword: (inputPassword: string) => boolean;
  generateAccessAndRereshToken: () => {
    accessToken: string;
    refreshToken: string;
  };
}

export interface IBookmark extends Document {
  url: string;
  category: Schema.Types.ObjectId;
  fav?: boolean;
  createdBy: Schema.Types.ObjectId;
}

export interface ICategory extends Document {
  category: string;
  createdBy: Schema.Types.ObjectId;
}
// export type Middleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => any;
