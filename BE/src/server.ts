import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./db";
dotenv.config();
const PORT = process.env.PORT || 3001;

connectDB()
  .then((data: string) => {
    console.log("mongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("server error", err);
  });
