import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { verifyJWT } from "./middlewears/user.middlewear";
import bookmarkRouter from "./routes/bookmarks.route";
import categoryRouter from "./routes/category.route";
import userRouter from "./routes/user.route";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", <any>verifyJWT, categoryRouter);
app.use("/api/v1/bookmark", <any>verifyJWT, bookmarkRouter);
app.get("/", (req, res): any => {
  //   res.clearCookie();
  return res.send("Server running fine");
});

export default app;
