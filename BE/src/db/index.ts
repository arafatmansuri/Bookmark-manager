import mongoose from "mongoose";

export const connectDB = async (): Promise<any> => {
  try {
    const connectionInstance = await mongoose.connect(
      <string>process.env.MONGO_URI
    );
    return connectionInstance.connection.db;
  } catch (error) {
    console.log("mongoDB connection error", error);
    process.exit(1);
  }
};
