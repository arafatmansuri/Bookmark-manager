import { RequestHandler as Middleware, Request, Response } from "express";
export interface Schema {
  userId: Date;
  username: string;
  password: string;
  bookmarks?: [
    {
      bId?: Date;
      url?: string;
      category?: string;
      fav?: boolean;
      createdAt?: Date;
    }
  ];
  categories?: [
    {
      id: Date;
      category: string;
    }
  ];
  refreshToken?: string;
}
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

// export type Middleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => any;
