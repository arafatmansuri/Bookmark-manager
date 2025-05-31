import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  category: string;
  createdBy: Schema.Types.ObjectId;
}

const CategorySchema: Schema<ICategory> = new Schema<ICategory>({
  category: { type: String, required: true, unique: true, trim: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryModel;
