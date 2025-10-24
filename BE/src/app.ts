import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import { verifyJWT } from "./middlewears/user.middlewear";
import bookmarkRouter from "./routes/bookmarks.route";
import categoryRouter from "./routes/category.route";
import userRouter from "./routes/user.route";
const app: Express = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://bookmark-manager-6dbg0frg0-mohammed-arafats-projects-b237d054.vercel.app",
  "https://bookmark-manager-bice.vercel.app",
  "https://bookmark-pro.vercel.app",
];
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(<string>origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", verifyJWT, categoryRouter);
app.use("/api/v1/bookmark", verifyJWT, bookmarkRouter);
app.get("/ping", (req, res): void => {
  //   res.clearCookie();
  res.status(200).json({ message: "Server running fine" });
  return;
});

export default app;
