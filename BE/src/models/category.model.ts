import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  category: string;
}

const CategorySchema: Schema<ICategory> = new Schema<ICategory>({
  category: { type: String, required: true, unique: true, trim: true },
});

const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryModel;
