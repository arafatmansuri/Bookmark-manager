import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types";

const CategorySchema: Schema<ICategory> = new Schema<ICategory>({
  category: { type: String, required: true, unique: true, trim: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryModel;
